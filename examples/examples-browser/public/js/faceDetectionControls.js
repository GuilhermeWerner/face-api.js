const SSD_MOBILENETV1 = 'ssd_mobilenetv1'
const TINY_FACE_DETECTOR = 'tiny_face_detector'


let selectedFaceDetector = SSD_MOBILENETV1

// ssd_mobilenetv1 options
let minConfidence = 0.5

// tiny_face_detector options
let inputSize = 512
let scoreThreshold = 0.5
let distanceThreshold = 0.5
let movementThreshold = 5; // Limite de movimento em pixels
let secondsThreshold = 5; // Limite de tempo em segundos

function getFaceDetectorOptions() {
  return selectedFaceDetector === SSD_MOBILENETV1
    ? new faceapi.SsdMobilenetv1Options({ minConfidence })
    : new faceapi.TinyFaceDetectorOptions({ inputSize, scoreThreshold })
}

function onIncreaseMinConfidence() {
  minConfidence = Math.min(faceapi.utils.round(minConfidence + 0.1), 1.0)
  $('#minConfidence').val(minConfidence)
  updateResults()
}

function onDecreaseMinConfidence() {
  minConfidence = Math.max(faceapi.utils.round(minConfidence - 0.1), 0.1)
  $('#minConfidence').val(minConfidence)
  updateResults()
}

function onInputSizeChanged(e) {
  changeInputSize(e.target.value)
  updateResults()
}

function changeInputSize(size) {
  inputSize = parseInt(size)

  const inputSizeSelect = $('#inputSize')
  inputSizeSelect.val(inputSize)
  inputSizeSelect.material_select()
}

function onIncreaseDistanceThreshold() {
  distanceThreshold = Math.min(faceapi.utils.round(distanceThreshold + 0.1), 1.0)
  $('#distanceThreshold').val(distanceThreshold)
  updateResults()
}

function onDecreaseDistanceThreshold() {
  distanceThreshold = Math.max(faceapi.utils.round(distanceThreshold - 0.1), 0.1)
  $('#distanceThreshold').val(distanceThreshold)
  updateResults()
}

function onIncreaseMovementThreshold() {
  movementThreshold = Math.min(faceapi.utils.round(movementThreshold + 1), 10)
  $('#movementThreshold').val(movementThreshold)
  updateResults()
}

function onDecreaseMovementThreshold() {
  movementThreshold = Math.max(faceapi.utils.round(movementThreshold - 1), 0)
  $('#movementThreshold').val(movementThreshold)
  updateResults()
}

function onIncreaseSecondsThreshold() {
  secondsThreshold = Math.min(faceapi.utils.round(secondsThreshold + 1), 10)
  $('#secondsThreshold').val(secondsThreshold)
  updateResults()
}

function onDecreaseSecondsThreshold() {
  secondsThreshold = Math.max(faceapi.utils.round(secondsThreshold - 1), 1)
  $('#secondsThreshold').val(secondsThreshold)
  updateResults()
}

function onIncreaseScoreThreshold() {
  scoreThreshold = Math.min(faceapi.utils.round(scoreThreshold + 0.1), 1.0)
  $('#scoreThreshold').val(scoreThreshold)
  updateResults()
}

function onDecreaseScoreThreshold() {
  scoreThreshold = Math.max(faceapi.utils.round(scoreThreshold - 0.1), 0.1)
  $('#scoreThreshold').val(scoreThreshold)
  updateResults()
}

function onIncreaseMinFaceSize() {
  minFaceSize = Math.min(faceapi.utils.round(minFaceSize + 20), 300)
  $('#minFaceSize').val(minFaceSize)
}

function onDecreaseMinFaceSize() {
  minFaceSize = Math.max(faceapi.utils.round(minFaceSize - 20), 50)
  $('#minFaceSize').val(minFaceSize)
}

function getCurrentFaceDetectionNet() {
  if (selectedFaceDetector === SSD_MOBILENETV1) {
    return faceapi.nets.ssdMobilenetv1
  }
  if (selectedFaceDetector === TINY_FACE_DETECTOR) {
    return faceapi.nets.tinyFaceDetector
  }
}

function isFaceDetectionModelLoaded() {
  return !!getCurrentFaceDetectionNet().params
}

async function changeFaceDetector(detector) {
  ['#ssd_mobilenetv1_controls', '#tiny_face_detector_controls']
    .forEach(id => $(id).hide())

  selectedFaceDetector = detector
  const faceDetectorSelect = $('#selectFaceDetector')
  faceDetectorSelect.val(detector)
  faceDetectorSelect.material_select()

  $('#loader').show()
  if (!isFaceDetectionModelLoaded()) {
    await getCurrentFaceDetectionNet().load('/')
  }

  $(`#${detector}_controls`).show()
  $('#loader').hide()
}

async function onSelectedFaceDetectorChanged(e) {
  selectedFaceDetector = e.target.value

  await changeFaceDetector(e.target.value)
  updateResults()
}

function initFaceDetectionControls() {
  const faceDetectorSelect = $('#selectFaceDetector')
  faceDetectorSelect.val(selectedFaceDetector)
  faceDetectorSelect.on('change', onSelectedFaceDetectorChanged)
  faceDetectorSelect.material_select()

  const inputSizeSelect = $('#inputSize')
  inputSizeSelect.val(inputSize)
  inputSizeSelect.on('change', onInputSizeChanged)
  inputSizeSelect.material_select()
}