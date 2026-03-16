'use server'

import { createClient } from '@/lib/supabase'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { randomUUID } from 'crypto'

async function uploadImage(supabase: any, file: File | null): Promise<string | null> {
  // CRITICAL: Check if file exists AND has content. 
  // Mobile browsers often send an empty file object if nothing is selected.
  if (!file || file.size === 0 || !file.name) return null;

  const bucket = 'meal-image';
  const ext = file.name.split('.').pop() || 'jpg';
  const path = `meals/${randomUUID()}.${ext}`;

  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    cacheControl: '3600',
    upsert: false,
  });

  if (error) {
    console.error('Error uploading image:', error.message);
    return null;
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data?.publicUrl ?? null;
}

export async function translateText(text: string) {
  if (!text) return "";
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=zh-CN&dt=t&q=${encodeURIComponent(text)}`;
    const res = await fetch(url);
    const data = await res.json();
    return data[0][0][0];
  } catch (e) { return ""; }
}

export async function saveMeal(formData: FormData) {
  const supabase = await createClient();
  const imageFile = formData.get('image_file') as File | null;
  const imageUrl = await uploadImage(supabase, imageFile);

  const data = {
    name_en: formData.get('name_en') as string,
    name_cn: formData.get('name_cn') as string,
    label: formData.get('label') as string,
    spicy_level: parseInt(formData.get('spicy_level') as string) || 0,
    description: formData.get('description') as string, // Added description support
    image_url: imageUrl,
  };

  const { error } = await supabase.from('meals').insert([data]);
  if (error) console.error('Insert error:', error.message);
  
  revalidatePath('/');
  redirect('/');
}

export async function updateMeal(id: number, formData: FormData) {
  const supabase = await createClient();
  
  // 1. Try to upload a new image
  const imageFile = formData.get('image_file') as File | null;
  const newImageUrl = await uploadImage(supabase, imageFile);

  // 2. Prepare the update object
  const data: any = {
    name_en: formData.get('name_en') as string,
    name_cn: formData.get('name_cn') as string,
    label: formData.get('label') as string,
    spicy_level: parseInt(formData.get('spicy_level') as string) || 0,
    description: formData.get('description') as string, // Added description support
  };

  // 3. ONLY update image_url if a new one was actually successfully uploaded.
  // This prevents overwriting the existing URL with NULL.
  if (newImageUrl) {
    data.image_url = newImageUrl;
  }

  const { error } = await supabase.from('meals').update(data).eq('id', id);
  if (error) console.error('Update error:', error.message);
  
  revalidatePath('/');
  revalidatePath(`/edit/${id}`); // Ensure the edit page also refreshes
  redirect('/');
}

export async function deleteMeal(id: number) {
  const supabase = await createClient();
  await supabase.from('meals').delete().eq('id', id);
  revalidatePath('/');
}