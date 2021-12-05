import { MoveOperation } from "./eventMessage";

/**
 * post eventMessage Object to api to read in labyrinth model
 * @param filelist: list of selected labyrinth for upload
 */
 async function sendMove(moveOperation: MoveOperation) {
    if (moveOperation) {
        await fetch("/lobby/move", {
          method: "POST",
          body: JSON.stringify(moveOperation),
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
  
  export function useMoveOperation() {
    return {
        sendMove,
    };
  }
  