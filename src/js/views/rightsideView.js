import { FULL_TIME, CIRCUMFERENCE } from "../config.js";
class RightsideView {
  _circle = document.querySelector(".progress");
  _time = document.querySelector(".time");
  _start_pauseBtn = document.querySelector(".start-pause-btn");
  _resetBtn = document.querySelector(".reset-btn");
  _fullTime = FULL_TIME;
  _circumference = CIRCUMFERENCE;
  _currentTime;
  _quote = document.querySelector("blockquote");
  _author = document.querySelector("cite");

  setTimer(time) {
    this._start_pauseBtn.textContent = "Pause";
    const tick = () => {
      if (this._isResuming) {
        this._isResuming = false;
        time =
          parseInt(this._currentTime.split(":")[0]) * 60 +
          parseInt(this._currentTime.split(":")[1]);
      }

      if (time > 0) time--;

      const min = String(Math.trunc(time / 60)).padStart(2, 0);
      const sec = String(time % 60).padStart(2, 0);

      this._currentTime = `${min}:${sec}`;
      this._time.textContent = this._currentTime;

      if (!this._currentOffset) this._currentOffset = this._circumference;

      const step = this._circumference / this._fullTime;

      this._currentOffset -= step;
      if (this._currentOffset < 0) this._currentOffset = 0;

      this._circle.style.strokeDashoffset = this._currentOffset;

      if (time === 0) {
        this.resetTimer();
      }
    };
    tick();
    this.timer = setInterval(tick, 1000);
  }
  resetTimer() {
    this._time.textContent = "25:00";
    clearInterval(this.timer);
    this._circle.style.strokeDashoffset = this._circumference;
    this._currentTime = "25:00";
    this._start_pauseBtn.textContent = "Start";
  }
  addStartPauseHandler() {
    this._start_pauseBtn.addEventListener("click", () => {
      if (this._start_pauseBtn.textContent === "Pause") {
        this._start_pauseBtn.textContent = "Start";
        this._time.textContent = this._currentTime;
        clearInterval(this.timer);
        this._isResuming = true;

        return;
      }

      this.setTimer(this._fullTime);
    });
  }
  addResetHandler() {
    this._resetBtn.addEventListener("click", () => {
      this.resetTimer();
    });
  }
  renderQuote(data) {
    this._quote.textContent = data.text;
    this._author.textContent = `— ${data.author}`;
  }
}
export default new RightsideView();
