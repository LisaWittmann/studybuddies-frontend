async function uploadFiles(filelist: FileList) {
  if (filelist != null) {
    for (let i = 0; i < filelist.length; i++) {
      const f = filelist[i];
      const data = new FormData();
      data.append("datei", f);
      try {
        const response = await fetch("localhost:9090/api/labyrinth/read", {
          method: "POST",
          body: data,
        });
        if (!response.ok) {
          throw new Error(response.statusText);
          return;
        }
      } catch (reason) {
        console.log(reason);
      }
    }
  }
}

//-------------------------------------------
export function useUploadService() {
  return {
    uploadFiles,
  };
}
