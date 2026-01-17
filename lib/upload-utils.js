export async function uploadFile(file, folder = "diit_uploads") {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);

    const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
    });

    const data = await response.json();

    if (!data.success) {
        throw new Error(data.message || "Upload failed");
    }

    return data;
}
