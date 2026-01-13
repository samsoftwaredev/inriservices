import { supabase } from "@/app/supabaseConfig";

type UploadProjectImageArgs = {
  projectId: string;
  companyId: string;
  kind: "before" | "after" | "progress" | "other";
  files: File[];
  caption?: string;
};

export async function uploadProjectImages({
  projectId,
  companyId,
  kind,
  files,
  caption,
}: UploadProjectImageArgs) {
  const bucket = "project-images";

  // Upload sequentially (safe). You can parallelize later.
  const results = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const imageId = crypto.randomUUID();

    const path = `${companyId}/${projectId}/${kind}/${imageId}.${ext}`;

    // 1) Upload to Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        upsert: false,
        contentType: file.type,
      });

    if (uploadError) throw uploadError;

    // 2) Insert metadata row
    const { data: row, error: dbError } = await supabase
      .from("project_images")
      .insert({
        company_id: companyId,
        project_id: projectId,
        kind,
        caption: caption ?? null,
        sort_order: i,
        storage_bucket: bucket,
        storage_path: uploadData.path,
        mime_type: file.type,
        size_bytes: file.size,
      })
      .select("*")
      .single();

    if (dbError) {
      // optional cleanup: delete file if db insert fails
      await supabase.storage.from(bucket).remove([uploadData.path]);
      throw dbError;
    }

    results.push(row);
  }

  return results;
}

export async function getSignedImageUrl(path: string) {
  const { data, error } = await supabase.storage
    .from("project-images")
    .createSignedUrl(path, 60 * 60); // 1 hour

  if (error) throw error;
  return data.signedUrl;
}