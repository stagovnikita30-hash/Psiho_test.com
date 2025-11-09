const submitBtn = document.getElementById("submitBtn");
const resultDiv = document.getElementById("result");

submitBtn.addEventListener("click", async () => {
  submitBtn.disabled = true;
  submitBtn.innerText = "Анализируем...";

  const answer = document.getElementById("answer").value || "не отвечено";

  try {
    const res = await fetch("/api/analyze.js", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answer })
    });

    const data = await res.json();
    resultDiv.innerText = data.analysis;
  } catch (err) {
    console.error(err);
    resultDiv.innerText = "Ошибка при анализе.";
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerText = "Анализировать";
  }
});
