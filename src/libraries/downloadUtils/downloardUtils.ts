export const downloadBlob = (blob: Blob, filename: string) => {
  const a = document.createElement("a");
  const blobURL = URL.createObjectURL(blob);
  a.href = blobURL;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(blobURL), 3000);
};

export const downloadFile = (blob: Blob, filename: string) => {
  const url = window.URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);

  document.body.appendChild(link);
  link.click();

  link.remove();
  window.URL.revokeObjectURL(url);
};
