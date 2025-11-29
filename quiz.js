/******************************************************
 * MOBILE VIEWPORT ADAPTER
 ******************************************************/
(function () {
    // Only add viewport meta if not already present
    if (!document.querySelector('meta[name="viewport"]')) {
        let meta = document.createElement("meta");
        meta.name = "viewport";
        meta.content = "width=device-width, initial-scale=1.0, maximum-scale=1.0";
        document.head.appendChild(meta);
    }
})();

/******************************************************
 * SESSION STORAGE – FAILED QUESTIONS
 ******************************************************/
let failedQuestions = JSON.parse(sessionStorage.getItem("failedQuestions") || "[]");

let quizFailedCount = 0;

// Update error counter after load (HTML has element #errorCount)
window.addEventListener("DOMContentLoaded", () => {
    const counter = document.getElementById("errorCount");
    if (counter) {
        counter.innerText = 0;// failedQuestions.length;
    }
});

/******************************************************
 * MARK PREVIOUSLY FAILED QUESTIONS
 ******************************************************/
window.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".question").forEach(q => {
        let qid = parseInt(q.dataset.qid);
        if (failedQuestions.includes(qid)) {
            quizFailedCount++;
            q.classList.add("failed-previously");
            let label = document.createElement("span");
            label.className = "failed-label";
            label.textContent = "⚠ Failed previously";
            q.prepend(label);
        }
    });

      if (quizFailedCount > 0) {
        document.getElementById("previousFailsBox").textContent =
            quizFailedCount + " of these questions were failed previously.";
    }

    failedQuestions = [];
});

/******************************************************
 * ANSWER SELECTION LOGIC
 ******************************************************/
function selectAnswer(questionId, optionId, isCorrect) {
    let container = document.getElementById("question-" + questionId);

    // Disable all buttons
    let buttons = container.querySelectorAll(".option-btn");
    buttons.forEach(btn => btn.classList.add("disabled"));

    // Show all explanations
    container.querySelectorAll(".explanation").forEach(expl => {
        expl.style.display = "block";
    });

    // Mark chosen button
    let chosen = document.getElementById("btn-" + questionId + "-" + optionId);
    chosen.classList.add(isCorrect ? "correct" : "incorrect");

    // Add correct label
    let resultLabel = document.getElementById("result-" + questionId);
    resultLabel.innerText = isCorrect ? "✔ Correct!" : "✖ Incorrect!";

    // Highlight the correct option
    let correctBtn = container.querySelector(".option-btn[data-correct='true']");
    if (correctBtn) correctBtn.classList.add("correct");

    // Handle incorrect answers
    if (!isCorrect) {
        failedQuestions.push(questionId);
        if (!failedQuestions.includes(questionId)) {
            sessionStorage.setItem("failedQuestions", JSON.stringify(failedQuestions));
        }
        document.getElementById("errorCount").innerText = failedQuestions.length;
        container.classList.add("failed-previously");
    }
}

/******************************************************
 * IMAGE URL NORMALIZER (with /quiz/ remover)
 ******************************************************/
window.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("img").forEach(img => {
        let finalPath = "";

        try {
            let url = new URL(img.src);
            finalPath = url.pathname.replace(/^\/+/, "");
        } catch (e) {
            finalPath = img.src.replace(/^\/+/, "");
        }

        // Remove "/quiz/" segments
        finalPath = finalPath.replace(/(^|\/)quiz\//g, "$1");

        // Force domain
        img.src = "https://superexpress.es/" + finalPath;
    });
});
