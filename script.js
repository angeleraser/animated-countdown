function timer({ durationMs, callback, intervalMs = 100, onComplete }) {
  let totalMs = 0;
  callback?.();
  const interval = setInterval(() => {
    totalMs += intervalMs;
    callback?.();
    if (totalMs >= durationMs) {
      clearInterval(interval);
      onComplete?.();
    }
  }, intervalMs);

  return interval;
}

class Countdown {
  constructor({ count = 3, intervalMs = 1000, label = "" }) {
    this.count = count > 60 ? 60 : count;
    this.intervalMs = intervalMs;
    this.label = label;
    this.root = this.createRoot();
  }

  createRoot() {
    const root = document.createElement("div");
    root.classList.add("countdown", "show");

    root.addEventListener("click", ({ target: { dataset } }) => {
      if (dataset.action === "replay") {
        this.init();

        const replayRoot = this.root.querySelector(".countdown-replay");

        replayRoot.classList.remove("show");
        replayRoot.classList.add("hide");
        setTimeout(() => replayRoot.remove(), this.intervalMs / 2);
      }
    });

    return root;
  }

  createCounterHTML() {
    const counter = document.createElement("div");
    counter.classList.add("countdown-counter");
    this.root.classList.add("countdown", "show");

    for (let value = this.count; value >= 0; value--) {
      counter.innerHTML += `
      <span data-state data-value="${value}" class="count">
        ${value}
      </span>
      `;
    }

    const label = document.createElement("h4");
    label.textContent = this.label;
    label.classList.add("countdown-label");

    this.root.append(counter, label);
  }

  init() {
    this.createCounterHTML();
    const counterEl = this.root.querySelector(".countdown-counter");

    const interval = this.intervalMs;
    let countIndex = this.count;

    timer({
      durationMs: interval * this.count,
      intervalMs: interval,
      callback() {
        const countEl = counterEl.querySelector(`[data-value="${countIndex}"]`);

        countEl.setAttribute("data-state", "in");

        setTimeout(() => {
          countEl.setAttribute("data-state", "out");
          countIndex -= 1;
        }, interval / 2);
      },
      onComplete: () =>
        setTimeout(() => {
          const countdownLabel = this.root.querySelector(".countdown-label");
          countdownLabel.classList.add("hide");

          this.root.innerHTML = `
        <div class="countdown-replay show">
          <div class="countdown-label">Go</div>
          <button data-action="replay">Replay</button>
        </div>
       `;

          this.root.classList.remove("show");
        }, interval),
    });
  }
}

const app = document.getElementById("app");
const countdown = new Countdown({ count: 5, label: "Get Ready!" });

app.appendChild(countdown.root);

countdown.init();
