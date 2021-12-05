import { MoveOperation } from "./EventMessage";

/**
 * post eventMessage Object to api to
 *
 */
async function sendMove(moveOperation: MoveOperation) {
  if (moveOperation) {
    console.log("fetch start")
    await fetch("/api/lobby/move", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
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
