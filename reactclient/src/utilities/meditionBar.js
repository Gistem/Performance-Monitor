import "./meditionBar.css";

function meditionBar(currentLoad) {
  let percentage = document.querySelector(".percentage");
  let percent = document.querySelector(".percent");
  percentage.style.width = currentLoad + "%";
  percent.innerHTML = currentLoad + "%";
  return (
    <div class="box">
      <div class="meditioner">
        <div class="barShape">
          <div class="level">
            <div class="percentage"></div>
          </div>
        </div>
        <div class="percent"></div>
        <h3>CPU Load</h3>
      </div>
    </div>
  );
}
export default meditionBar;
