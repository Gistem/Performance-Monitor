import React from "react";
import drawCircle from "../utilities/canvasLoadAnimation";

function Mem(props) {
  //   console.log(props);
  const { totalMem, usedMem, memUseage, freeMem } = props.memData;
  const canvas = document.querySelector(`.memCanvas`);
  const totalMemInGb = Math.floor((totalMem / 1073741824) * 100) / 100;
  const freeMemInGb = Math.floor((freeMem / 1073741824) * 100) / 100;

  drawCircle(canvas, memUseage * 100);

  return (
    <div className="col-sm-3 mem">
      <h3>Memory Useage</h3>
      <div>
        <canvas className="memCanvas" width="200" height="200"></canvas>
        <div className="mem-text">{memUseage * 100}%</div>
      </div>
      <div>Total Memory: {totalMemInGb}gb</div>
      <div>Free Memory: {freeMemInGb}gb</div>
    </div>
  );
}
export default Mem;
