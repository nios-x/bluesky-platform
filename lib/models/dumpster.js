//lib/models/dumpster.js
export async function getDumpsters(supabase) {
  const { data, error } = await supabase
    .from("dumpsters")
    .select(
      `
      id,
      title,
      images,
      allowed_items,
      not_allowed_items,
      dumpster_type_id,
      dumpster_size_id,
      dumpster_types ( id, name ),
      dumpster_sizes ( id, label )
    `,
    )
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
  const { error } = await supabase.from("dumpsters").delete().eq("id", id);

  if (error) throw new Error(error.message);
  return true;
}


export async function getDumpstersByType(supabase, typeSlug) {
  // get dumpster type first

  const { data: dumpsterType, error: typeError } = await supabase
    .from("dumpster_types")
    .select(
      `
      id,
      name,
      slug
    `,
    )
    .eq("slug", typeSlug)
    .single();

  if (typeError) {
    console.log("TYPE ERROR:", typeError);

    throw new Error(typeError.message);
  }

  // fetch dumpsters + all frontend fields + size relation

  const { data, error } = await supabase
    .from("dumpsters")
    .select(
      `
      *,

      dumpster_types(
        id,
        name,
        slug
      ),

      dumpster_sizes(
        id,
        label,
        width_ft,
        height_ft,
        length_ft
      )

    `,
    )

    .eq("dumpster_type_id", dumpsterType.id)

    .order("title", {
      ascending: true,
    });

  if (error) {
    console.log("DUMPSTER ERROR:", error);

    throw new Error(error.message);
  }

  return data || [];
}

export async function getDumpsterByTypeAndSlug(
  supabase,
  typeSlug,
  dumpsterSlug,
) {
  const { data, error } = await supabase
    .from("dumpsters")
    .select(
      `
      *,

      dumpster_types (
        id,
        name,
        slug
      ),

      dumpster_sizes (
        id,
        label,
        width_ft,
        height_ft,
        length_ft
      )
    `,
    )

    .eq("slug", dumpsterSlug)
    .eq("dumpster_types.slug", typeSlug)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}