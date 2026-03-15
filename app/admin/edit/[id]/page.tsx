import { createClient } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import EditMealForm from './EditMealForm';

export default async function EditPage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient();
  const { id } = await params;

  // Fetch the specific meal from Supabase
  const { data: meal, error } = await supabase
    .from('meals')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !meal) {
    return notFound();
  }

  return <EditMealForm meal={meal} />;
}