/** canvas object */
var cv;
/** 2-dimension context */
var c;

var width = 1600;
var height = 1200;
var padding = 10;

var r = (Math.min(width, height) - 2 * padding) / 2;

var p0 = { x: (width - 2 * padding) / 2, y: padding };
/** 頂点座標 */
var vertex;

/**
 * 指定した頂点1つの座標を取得する。
 * @param {} vertex 頂点ズ
 * @param {*} coordinatesArray 頂点を特定する0,1の配列（配列の長さ=次元数）
 */
function getVertex(coordinatesArray) {
  var target = vertex;
  for (var index = 0; index < coordinatesArray.length; index++) {
    target = target[coordinatesArray[index]];
  }

  return target;
}

/**
 * 基本となるベクトルを作る
 * @param {} dim 
 * @param {*} r 
 */
function createBaseVector(dim, r) {
  var vectors = [];
  var angle = Math.PI / (2 * dim);
  var nolm = 2 * r * Math.sin(angle);
  for (var count = 0; count < dim; count++) {
    var vector = {};
    vector.x = nolm * Math.cos(angle * (2 * count + 1));
    vector.y = nolm * Math.sin(angle * (2 * count + 1));
    vectors.push(vector);
  }
  return vectors;
}

/**
 * vertexを作る
 * @param {*} p0 
 * @param {*} dim 
 * @param {*} vectors 
 */
function createVertex(p0, dim, vectors) {
  var vertex = [];
  createVertexRecursive(vertex, p0, vectors, dim, 1, []);

  return vertex;
}

/**
 * vertexのひな形を再帰的に作る
 * @param {*} subVertex 
 * @param {*} limit 
 * @param {*} dim 
 */
function createVertexRecursive(subVertex, p0, vectors, limit, dim, indexes) {
  if (dim === limit) {
    // 座標作成
    var coordinates = { x: p0.x, y: p0.y };
    // var target = subVertex;
    for (var index = 0; index < indexes.length; index++) {
      if (indexes[index] === 1) {
        coordinates.x += vectors[index].x;
        coordinates.y += vectors[index].y;
      }
    }
    subVertex[0] = coordinates;
    subVertex[1] = { x: coordinates.x + vectors[dim - 1].x, y: coordinates.y + vectors[dim - 1].y };

    // 点を描画する
    c.beginPath();
    c.fillStyle = 'Black';
    c.arc(subVertex[0].x, subVertex[0].y, 2, 0, 2 * Math.PI, false);
    c.stroke();
    c.beginPath();
    c.fillStyle = 'Black';
    c.arc(subVertex[1].x, subVertex[1].y, 2, 0, 2 * Math.PI, false);
    c.stroke();
    return;
  }
  // 次の次元に対して再帰処理
  subVertex[0] = [];
  var indexes_0 = indexes.slice();
  indexes_0.push(0);
  createVertexRecursive(subVertex[0], p0, vectors, limit, dim + 1, indexes_0);
  subVertex[1] = [];
  var indexes_1 = indexes.slice();
  indexes_1.push(1);
  createVertexRecursive(subVertex[1], p0, vectors, limit, dim + 1, indexes_1);
}

function drawLine(dim) {
  drawLineRecursive(dim, []);
}

/**
 * 再帰的に線を引く
 * @param {} dim 全体の次元
 * @param {*} indexArray 座標を表す0,1の配列（長さは次元数 - 1）
 * @param {*} dimIndex 引く線の向きを表す次元（0～n-1）
 */
function drawLineRecursive(dim, indexArray) {
  if (indexArray.length === dim - 1) {
    // 描画
    for (var dimIndex = 0; dimIndex < dim; dimIndex++) {
      var fullIndexArray0 = indexArray.slice();
      fullIndexArray0.splice(dimIndex, 0, 0);
      var fullIndexArray1 = indexArray.slice();
      fullIndexArray1.splice(dimIndex, 0, 1);

      var startVertex = getVertex(fullIndexArray0);
      var endVertex = getVertex(fullIndexArray1);

      c.beginPath();
      c.moveTo(startVertex.x, startVertex.y);
      c.lineTo(endVertex.x, endVertex.y);
      c.stroke();
    }
    return;
  }

  var indexArray0 = indexArray.slice();
  indexArray0.push(0);
  drawLineRecursive(dim, indexArray0);

  var indexArray1 = indexArray.slice();
  indexArray1.push(1);
  drawLineRecursive(dim, indexArray1);
}

/**
 * 各vertexの周りに点を描画する
 */
function drawVertexPoint() {

}

/**
 * 入力があった時に、次元を変更して描画しなおす
 */
function updateDimension() {
  var dim = Number($("#dimension").val());
  if (Number.isNaN(dim) || dim < 0) {
    $('#error').show();
    return;
  }
  $('#error').hide();
  draw(dim);
}

/**
 * 描画する
 * @param {*} dim dimension
 */
function draw(dim) {
  c.clearRect(0, 0, width, height);
  vectors = createBaseVector(dim, r);
  vertex = createVertex(p0, dim, vectors);
  drawLine(dim);
}

/**
 * 初期化
 */
$(document).ready(() => {
  $('#error').hide();
  $("#dimension").change(updateDimension);
  cv = document.querySelector('#cv');
  c = cv.getContext('2d');
  // Canvas APIが利用できるかを判定（1）
  if (HTMLCanvasElement) {
    updateDimension();
  }
})


