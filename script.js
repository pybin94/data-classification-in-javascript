const speed = 1000;
const api = "./data.json";

const init = () => {
  patternTab();
  patternTabClick();
}

const callListApi = async () => {
  try {

    const res = await fetch(api);
    const data = await res.json();
    console.log(data);
    return data;

  } catch ( error ){
    console.log( "callListApi", error );
  }
}

const middleTabList = async (dataPattern, patternA, patternB) => {

  const pastResult = await callListApi();

  const patternGraph = document.querySelector("#patternGraph");

  let arrayNum = 0;
  let nowTimes = 0;

  patternGraph.innerHTML = ""

  const pattern = () => {

      if(arrayNum == pastResult.length){
          return false;
      }

      typeB()

      if(arrayNum == pastResult.length){
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
          if(arrayNum == pastResult.length){
              break;
          };
      }
      columnTabel.innerHTML += `
              <div class="num-cover" style="margin-top:auto;"><span class="length">${arrayNum - nowArrayNum }</span></div>
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
        if(arrayNum == pastResult.length){
            break;
        }
    }

    columnTabel.innerHTML += `
        <div class="num-cover" style="margin-top:auto;"><span class="length">${arrayNum - nowArrayNum }</span></div>
        <div class="num-cover"><span class="length">${nowTimes}</span></div>
    `;
    nowTimes++;
  }

  pattern()
  document.querySelector("#cellImg").scrollLeft = 10000;       //스크롤 우측 자동이동

}


const patternTab = () => {

  const graphTap = document.querySelectorAll("#graphTab > div");

  if(graphTap[0].classList.contains('active')){
    middleTabList("ko", "가", "나");

  } else if (graphTap[1].classList.contains('active')){
    middleTabList("num", "1", "2");

  } else if (graphTap[2].classList.contains('active')){
    middleTabList("eg", "A", "B");

  }
};

const patternTabClick = () => {

  const graphTap = document.querySelectorAll("#graphTab > div")

  for(let i = 0; i < graphTap.length; i++){

    graphTap[i].addEventListener("click", () => {

      while (patternGraph.hasChildNodes()) {	// 부모노드가 자식이 있는지 여부를 알아낸다
          patternGraph.removeChild(
              patternGraph.firstChild
          );
      };

      for(let j = 0; j < graphTap.length; j++){
          graphTap[j].classList.remove("active")
      };

      graphTap[i].classList.add("active")
      if( graphTap[i] == graphTap[0] ){
        middleTabList("ko", "가", "나")

      } else if ( graphTap[i] == graphTap[1] ){
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
  patternTab();
}, speed );

