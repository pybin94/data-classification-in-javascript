const speed = 1000;
const api = "./data.json";

const init = () => {
  patternTab();
  patternTabClick();
  sortData("ko", "가", "typeGa", "typeNa")
  sortData("num", "1", "type1", "type2")
  sortData("eg", "A", "typeA", "typeB")
}

// API 호출
const callApi = async () => {
  try {
    const res = await fetch(api);
    const data = await res.json();
    return data;
  } catch (error) {
    alert("통신에 문제가 생겼습니다. 관리자에게 문의 주세요. \n" + error);
  }
}

// 상단 데이터
const analysis = async (gameType, gameResult) => {
  let left = 0;
  let right = 0;

  result = await callApi()
  result.map((item, index) => {
    result[index][gameType] == gameResult ? left++ : right++;
  })

  let perRight = (right / 64 * 100).toFixed(2)
  let perLeft = (left / 64 * 100).toFixed(2)
  return [left, right, perRight, perLeft];
}

const sortData = async (gameType, gameResult, leftEle, rightEle) => {

  let analysisRes = await analysis(gameType, gameResult)
  let leftRes = analysisRes[0]
  let rightRes = analysisRes[1]
  let perRightRes = analysisRes[2]
  let perLeftRes = analysisRes[3]

  document.querySelector(`#${leftEle}`).style.width = perLeftRes + "%"
  document.querySelector(`#${leftEle}`).innerHTML = `<p><b>${leftRes}</b>(${perLeftRes}%)</p>`
  document.querySelector(`#${rightEle}`).style.width = perRightRes + "%"
  document.querySelector(`#${rightEle}`).innerHTML = `<p><b>${rightRes}</b>(${perRightRes}%)</p>`

  if (perLeftRes > perRightRes) {
    document.querySelector(`#${leftEle}`).classList.add("active")
    document.querySelector(`#${rightEle}`).classList.remove("active")
  } else if (perLeftRes < perRightRes) {
    document.querySelector(`#${leftEle}`).classList.remove("active")
    document.querySelector(`#${rightEle}`).classList.add("active")
  } else if (perLeftRes == perRightRes) {
    document.querySelector(`#${leftEle}`).classList.remove("active")
    document.querySelector(`#${rightEle}`).classList.remove("active")
  }
}

// 하단 데이터
const middleTabList = async (dataPattern, patternA, patternB) => {

  const pastResult = await callApi();

  const patternGraph = document.querySelector("#patternGraph");

  let arrayNum = 0;
  let nowTimes = 0;

  patternGraph.innerHTML = ""

  const pattern = () => {

    if (arrayNum == pastResult.length) {
      return false;
    }

    typeB()

    if (arrayNum == pastResult.length) {
      return false;
    }

    typeA();
    pattern();
  }

  const typeA = () => {
    const columnTabel = document.createElement("div")
    let nowArrayNum = arrayNum;

    columnTabel.innerHTML = "";

    columnTabel.classList.add("column-tabel");
    columnTabel.innerHTML += `
              <div class="num-cover"><span class="typeA">${patternA}</span></div>
          `;

    while (pastResult[arrayNum][dataPattern] == patternA) {
      columnTabel.innerHTML += `
              <div class="num-cover"><span class="data${pastResult[arrayNum][dataPattern]}">${pastResult[arrayNum]["id"]}</span></div>
          `;

      patternGraph.appendChild(columnTabel);
      arrayNum++;
      if (arrayNum == pastResult.length) {
        break;
      };
    }
    columnTabel.innerHTML += `
              <div class="num-cover" style="margin-top:auto;"><span class="length">${arrayNum - nowArrayNum}</span></div>
              <div class="num-cover"><span class="length">${nowTimes}</span></div>
          `;
    nowTimes++;
  }

  const typeB = () => {

    const columnTabel = document.createElement("div");
    let nowArrayNum = arrayNum;

    columnTabel.innerHTML = "";

    columnTabel.classList.add("column-tabel");
    columnTabel.innerHTML += `
            <div class="num-cover"><span class="typeB">${patternB}</span></div>
        `;

    while (pastResult[arrayNum][dataPattern] == patternB) {
      columnTabel.innerHTML += `
            <div class="num-cover"><span class="data${pastResult[arrayNum][dataPattern]}">${pastResult[arrayNum]["id"]}</span></div>
        `;

      patternGraph.appendChild(columnTabel);
      arrayNum++;
      if (arrayNum == pastResult.length) {
        break;
      }
    }

    columnTabel.innerHTML += `
        <div class="num-cover" style="margin-top:auto;"><span class="length">${arrayNum - nowArrayNum}</span></div>
        <div class="num-cover"><span class="length">${nowTimes}</span></div>
    `;
    nowTimes++;
  }

  pattern()
  document.querySelector("#cellImg").scrollLeft = 10000;       //스크롤 우측 자동이동

}


const patternTab = () => {

  const graphTap = document.querySelectorAll("#graphTab > div");

  if (graphTap[0].classList.contains('active')) {
    middleTabList("ko", "가", "나");

  } else if (graphTap[1].classList.contains('active')) {
    middleTabList("num", "1", "2");

  } else if (graphTap[2].classList.contains('active')) {
    middleTabList("eg", "A", "B");

  }
};

const patternTabClick = () => {

  const graphTap = document.querySelectorAll("#graphTab > div")

  for (let i = 0; i < graphTap.length; i++) {

    graphTap[i].addEventListener("click", () => {

      while (patternGraph.hasChildNodes()) {	// 부모노드가 자식이 있는지 여부를 알아낸다
        patternGraph.removeChild(
          patternGraph.firstChild
        );
      };

      for (let j = 0; j < graphTap.length; j++) {
        graphTap[j].classList.remove("active")
      };

      graphTap[i].classList.add("active")
      if (graphTap[i] == graphTap[0]) {
        middleTabList("ko", "가", "나")

      } else if (graphTap[i] == graphTap[1]) {
        middleTabList("num", "1", "2")

      } else {
        middleTabList("eg", "A", "B")

      }
    })
  }
};

init();

// 데이터 갱신
setInterval(() => {
  //   patternTab();
}, speed);

