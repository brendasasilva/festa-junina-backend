document.addEventListener('DOMContentLoaded', () => {
  const API_URL = 'https://script.google.com/macros/s/AKfycbyhec6RRc1_adGPHMbv83kHaoOHvUcYbcyDS-H89aNbzYoTbL5sOy3aMtfI1IsQs0Tn/exec';
  const pratoSelect = document.getElementById('prato');
  const form = document.getElementById('form');
  const mensagem = document.getElementById('mensagem');

  function carregarPratos() {
    fetch(API_URL)
      .then(res => res.json())
      .then(pratos => {
		if (!Array.isArray(pratos)) throw new Error("Resposta inválida da API");
		pratoSelect.innerHTML = '<option value="">-- Selecione --</option>';
		pratos.forEach(prato => {
			const option = document.createElement('option');
			option.value = prato;
			option.textContent = prato;
			pratoSelect.appendChild(option);
		});
	})
      .catch(() => {
        mensagem.style.color = 'red';
        mensagem.textContent = 'Erro ao carregar pratos disponíveis.';
      });
  }

  carregarPratos();

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

    fetch(API_URL, {
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
          carregarPratos();  // Atualiza a lista para remover prato escolhido
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
