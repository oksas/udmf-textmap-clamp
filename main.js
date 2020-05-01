if (!window.Worker) {
  alert('A more modern browser is required to use this tool, sorry!');
}

const worker = new Worker('worker.js');
const $fileProxy = document.querySelector('.file-proxy');
const $file = document.querySelector('#file');

$fileProxy.addEventListener('click', function () {
  $file.click();
});
$file.addEventListener('change', handleChange);

function handleChange(e) {
  if (!e.target.files.length) return;

  setLoading(true);

  let $file = e.target;
  let reader = new FileReader();

  reader.onload = () => {
    worker.postMessage(reader.result);
  };

  reader.readAsText(e.target.files[0]);
}

worker.onmessage = function (e) {
  downloadText('TEXTMAP.txt', e.data);
  setLoading(false);
};

function downloadText(filename, text) {
  const $temp = document.createElement('a');
  $temp.setAttribute(
    'href',
    'data:text/plain;charset=utf-8,' + encodeURIComponent(text)
  );
  $temp.setAttribute('download', filename);
  $temp.style.display = 'none';
  document.body.appendChild($temp);

  $temp.click();
  document.body.removeChild($temp);
}

function setLoading(isLoading = true) {
  if (isLoading) {
    document.body.classList.add('is-loading');
    $fileProxy.disabled = true;
  } else {
    document.body.classList.remove('is-loading');
    $fileProxy.disabled = false;
  }
}
