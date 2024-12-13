
import type { PlasmoCSConfig } from "plasmo"

export const config: PlasmoCSConfig = {
  matches: ["https://www.google.com/"],
  all_frames: true,
}

export { }

let searchinput: HTMLTextAreaElement = null
let resultContainer: HTMLDivElement = null
let resultText: HTMLParagraphElement = null

function setup() {
  searchinput = document.querySelector("form textarea")

  if (!searchinput) {
    console.error("Unable to detect search input!!!")

    return
  }

  let targetParent = document.querySelector("#gws-output-pages-elements-homepage_additional_languages__als")

  if (!targetParent) {
    console.error("Unable to detect search input!!!")

    return
  }

  targetParent = targetParent.parentElement

  resultContainer = document.createElement("div")
  resultContainer.style
  resultContainer.style.position = "fixed"
  resultContainer.style.top = "60%"
  resultContainer.style.left = "50%"
  resultContainer.style.transform = "translateX(-50%)"
  resultContainer.style.width = "100%"
  resultContainer.style.height = "auto"
  resultContainer.style.display = "flex"
  resultContainer.style.flexDirection = "column"
  resultContainer.style.alignItems = "center"

  resultText = document.createElement("p")
  resultText.style.width = "60%"
  resultText.style.textAlign = "center"

  resultContainer.id = "result-container"
  resultText.id = "result-text"

  resultText.textContent = ""

  targetParent.appendChild(resultContainer)
  resultContainer.appendChild(resultText)

  searchinput.addEventListener("keydown", onSearchEnter)
}

function onSearchEnter(e: KeyboardEvent) {
  e.stopPropagation()

  if (!searchinput) {
    console.error("Unable to detect search input!!!")

    return
  }


  if (e.key !== "Enter") {
    return
  }

  getSearchResult()
}

async function fetchSearchResult(query: string) {
  try {
    const res = await fetch(`http://localhost:3000/api/search?q=${query}`)

    if (res.status !== 200) {
      throw new Error("Unable to fetch response")
    }

    const data = await res.text();

    return data
  } catch (error) {
    console.log("Error at fetchSearchResult")
    console.error(error);
  }
}

async function getSearchResult() {
  let searchLoadingInterval = null

  try {
    let count = 1;

    resultText.textContent = "Generating response, Please wait a few seconds"

    searchLoadingInterval = setInterval(() => {
      if (count > 5) {
        count = 1
      }

      resultText.textContent = "Generating response, Please wait a few seconds" + ".".repeat(count)

      count++;
    }, 500)

    const completion = await fetchSearchResult(searchinput.value ?? "")

    resultText.textContent = completion
  } catch (error) {
    resultText.textContent = "Unable to fetch search completion"

    console.log("Error at getSearchResult")
    console.error(error);
  } finally {
    clearInterval(searchLoadingInterval)
  }
}

setup()