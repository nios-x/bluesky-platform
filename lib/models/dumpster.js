export async function getDumpsters(supabase) {
  const { data, error } = await supabase
    .from("dumpsters")
    .select(`
      id,
      title,
      images,
      allowed_items,
      not_allowed_items,
      dumpster_type_id,
      dumpster_size_id,
      dumpster_types ( id, name ),
      dumpster_sizes ( id, label )
    `)
    .order("title", { ascending: true });

  if (error) throw new Error(error.message);
  return data;
}

export async function getDumpsterMetadata(supabase) {
  const { data: types, error: typesError } = await supabase
    .from("dumpster_types")
    .select("id, name")
    .eq("is_active", true)
    .order("name", { ascending: true });
    
  if (typesError) throw new Error(typesError.message);

  const { data: sizes, error: sizesError } = await supabase
    .from("dumpster_sizes")
    .select("id, label, width_ft, height_ft, length_ft")
    .order("label", { ascending: true });

  if (sizesError) throw new Error(sizesError.message);

  return { types, sizes };
}

export async function createDumpster(supabase, payload) {
  const { data, error } = await supabase
    .from("dumpsters")
    .insert(payload)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function updateDumpster(supabase, id, payload) {
  const { data, error } = await supabase
    .from("dumpsters")
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function deleteDumpster(supabase, id) {
  const { error } = await supabase
    .from("dumpsters")
    .delete()
    .eq("id", id);

  if (error) throw new Error(error.message);
  return true;
}
