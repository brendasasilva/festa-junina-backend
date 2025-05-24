document.addEventListener('DOMContentLoaded', () => {
  const API_URL = 'https://festa-junina-backend.onrender.com';
  const pratoSelect = document.getElementById('prato');
  const form = document.getElementById('form');
  const mensagem = document.getElementById('mensagem');

  // Carrega a lista de pratos disponíveis
  fetch(`${API_URL}/api/pratos`)
    .then(res => res.json())
    .then(data => {
      pratoSelect.innerHTML = '<option value="">-- Selecione --</option>';
      data.forEach(prato => {
        const option = document.createElement('option');
        option.value = prato;
        option.textContent = prato;
        pratoSelect.appendChild(option);
      });
    });

  form.addEventListener('submit', e => {
    e.preventDefault();

    const nome1 = document.getElementById('nome1').value.trim();
    const nome2 = document.getElementById('nome2').value.trim();
    const nome3 = document.getElementById('nome3').value.trim();
    const nome4 = document.getElementById('nome4').value.trim();

    const nomes = [nome1, nome2, nome3, nome4].filter(Boolean).join(', ');
    const prato = pratoSelect.value;

    if (!nomes || !prato) {
      mensagem.style.color = 'red';
      mensagem.textContent = 'Por favor, preencha o nome e escolha um prato.';
      return;
    }

    fetch(`${API_URL}/api/confirmar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome: nomes, prato })
    })
    .then(res => res.json())
    .then(data => {
      if (data.sucesso) {
        mensagem.style.color = 'green';
        mensagem.textContent = 'Confirmação enviada com sucesso!';
        form.reset();
        pratoSelect.querySelector(`option[value="${prato}"]`)?.remove();
      } else {
        mensagem.style.color = 'red';
        mensagem.textContent = data.erro || 'Erro ao enviar confirmação.';
      }
    })
    .catch(() => {
      mensagem.style.color = 'red';
      mensagem.textContent = 'Erro de conexão. Tente novamente mais tarde.';
    });
  });
});
