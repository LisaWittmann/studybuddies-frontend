/**
 * post selected json file to api to read in labyrinth model
 * @param filelist: list of selected labyrinth for upload
 */
async function uploadJsonFiles(filelist: FileList) {
  if (filelist) {
    for (const file of filelist) {
      const data = new FormData();
      data.append("labFile", file);
      await fetch("/api/labyrinth/read", {
        method: "POST",
        body: data,
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(response.statusText);
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }
}

export function useLabyrinthService() {
  return {
    uploadJsonFiles,
  };
}
