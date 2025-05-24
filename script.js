document.addEventListener('DOMContentLoaded', () => {
  const pratoSelect = document.getElementById('prato');
  const form = document.getElementById('form');
  const mensagem = document.getElementById('mensagem');

  // ✅ Lista fixa de pratos
  const pratosDisponiveis = [
      "Milho verde (1kg)",
      "Cuscuz paulista",
	  "Cuscuz paulista",
      "Caldo verde",
      "Caldo de feijão",
      "Caldo de kenga",
	  "Cachorro Quente",
      "Pipoca (2 pacotes e o saco de pipoca)",
      "Carne louca",
      "Carne louca",
      "Torta frango",
      "Torta de frango",
      "Torta de carne moída",
	  "Torta de carne moída",
      "Torta de sardinha",
      "Torta de sardinha",
	  "Vinho quente (1L)",
      "Vinho quente (1L)",
      "Quentão (1L)",
      "Choconhaque (1L)",
	  "Canjica (50 unidades)",
      "Canjica (50 unidades)",
      "Cural (50 unidades)",
      "Cural (50 unidades)",
      "Arroz doce (50 unidades)",
      "Arroz doce (50 unidades)",
      "Pé de moleque (50 unidades)",
      "Pé de moleque (50 unidades)",
      "Paçoca (50 unidades)",
      "Paçoca (50 unidades)",
      "Pé de moça (50 unidades)",
      "Bolo de milho (1 unidade)",
      "Bolo de milho (1 unidade)",
      "Bolo de fubá (1 unidade)",
      "Bolo de fubá (1 unidade)",
      "Bolo de laranja (1 unidade)",
      "Bolo de laranja (1 unidade)",
      "Bolo de chocolate (1 unidade)",
      "Bolo de chocolate (1 unidade)",
      "Doce de abóbora (50 unidades)",
      "Amendoim cozido (1kg)",
      "Amendoim cozido (1kg)",
	  "Descartável",
  ];

  // Preenche o select com a lista de pratos
  pratoSelect.innerHTML = '<option value="">-- Selecione --</option>';
  pratosDisponiveis.forEach(prato => {
    const option = document.createElement('option');
    option.value = prato;
    option.textContent = prato;
    pratoSelect.appendChild(option);
  });

  // Envia o formulário
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

    // Aqui você ainda envia para o back-end se quiser gravar
    fetch('https://festa-junina-backend.onrender.com/api/confirmar', {
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
