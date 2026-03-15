// app/admin/add/actions.ts full code
'use server'

import { createClient } from '@/lib/supabase'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

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
  const data = {
    name_en: formData.get('name_en') as string,
    name_cn: formData.get('name_cn') as string,
    label: formData.get('label') as string, // This must match the hidden input name
    spicy_level: parseInt(formData.get('spicy_level') as string) || 0,
    image_url: formData.get('image_url') as string,
  };

  const { error } = await supabase.from('meals').insert([data]);
  if (error) console.error(error);
  revalidatePath('/');
  redirect('/');
}

export async function updateMeal(id: number, formData: FormData) {
  const supabase = await createClient();
  const data = {
    name_en: formData.get('name_en') as string,
    name_cn: formData.get('name_cn') as string,
    label: formData.get('label') as string,
    spicy_level: parseInt(formData.get('spicy_level') as string) || 0,
  };

  const { error } = await supabase.from('meals').update(data).eq('id', id);
  if (error) console.error(error);
  revalidatePath('/');
  redirect('/');
}

export async function deleteMeal(id: number) {
  const supabase = await createClient();
  await supabase.from('meals').delete().eq('id', id);
  revalidatePath('/');
}