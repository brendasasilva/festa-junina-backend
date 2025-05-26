import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// === COLE AQUI SUAS CONFIGURAÇÕES DO FIREBASE ===
const firebaseConfig = {
  apiKey: "AIzaSyB9LFWejeuBM5dgrFjvrTA4feb2Uf1gddI",
  authDomain: "arraia-dos-amigos-f5eaa.firebaseapp.com",
  projectId: "arraia-dos-amigos-f5eaa",
  storageBucket: "arraia-dos-amigos-f5eaa.firebasestorage.app",
  messagingSenderId: "218194034767",
  appId: "1:218194034767:web:dc6832912aa93af6af2a3a"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

document.addEventListener('DOMContentLoaded', () => {
  const pratoSelect = document.getElementById('prato');
  const form = document.getElementById('form');
  const mensagem = document.getElementById('mensagem');

  async function carregarPratos() {
    pratoSelect.innerHTML = '<option value="">Selecione...</option>';
    try {
      const pratosSnap = await getDocs(collection(db, "pratos"));
      pratosSnap.forEach(docSnap => {
        const pratoData = docSnap.data();
        const option = document.createElement('option');
        option.value = docSnap.id; // id do documento para remoção posterior
        option.textContent = pratoData.nome;
        pratoSelect.appendChild(option);
      });
      if(pratoSelect.options.length === 1){
        mensagem.style.color = 'red';
        mensagem.textContent = "Todos os pratos já foram escolhidos!";
      } else {
        mensagem.textContent = "";
      }
    } catch (err) {
      mensagem.style.color = 'red';
      mensagem.textContent = 'Erro ao carregar pratos.';
      console.error(err);
    }
  }

  form.addEventListener('submit', async e => {
    e.preventDefault();

    const nome1 = document.getElementById('nome1').value.trim();
    const nome2 = document.getElementById('nome2').value.trim();
    const nome3 = document.getElementById('nome3').value.trim();
    const nome4 = document.getElementById('nome4').value.trim();

    const nomes = [nome1, nome2, nome3, nome4].filter(Boolean).join(', ');
    const pratoId = pratoSelect.value;
    const pratoNome = pratoSelect.options[pratoSelect.selectedIndex]?.text;

    if (!nomes) {
      mensagem.style.color = 'red';
      mensagem.textContent = 'Por favor, preencha pelo menos um nome.';
      return;
    }
    if (!pratoId) {
      mensagem.style.color = 'red';
      mensagem.textContent = 'Por favor, escolha um prato.';
      return;
    }

    try {
      // Salvar confirmação
      await addDoc(collection(db, "confirmacoes"), {
        nomes,
        prato: pratoNome,
        timestamp: new Date()
      });

      // Remover prato da lista global
      await deleteDoc(doc(db, "pratos", pratoId));

      mensagem.style.color = 'green';
      mensagem.textContent = "Confirmação enviada com sucesso!";

      form.reset();
      await carregarPratos();
    } catch (err) {
      mensagem.style.color = 'red';
      mensagem.textContent = 'Erro ao enviar confirmação.';
      console.error(err);
    }
  });

  carregarPratos();
});
