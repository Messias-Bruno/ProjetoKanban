// ../js/index.js  (substitua totalmente pelo conteúdo abaixo)
let editingIndex = null;

document.addEventListener('DOMContentLoaded', () => {
  try {
    // Se estivermos na página do board (colA, colB, colC presentes) -> carregar tarefas e modal
    if (document.getElementById('colA') || document.getElementById('colB') || document.getElementById('colC')) {
      loadTasks();
      setupModalListeners();
      console.log('Kanban: loadTasks e modal configurados.');
    }

    // Se estivermos na página nova-tarefa (btnAdd presente) -> conectar o botão adicionar
    const btnAdd = document.getElementById('btnAdd');
    if (btnAdd) {
      btnAdd.addEventListener('click', handleAddTask);
      console.log('Nova Tarefa: listener do botão Adicionar conectado.');
    }
  } catch (err) {
    console.error('Erro na inicialização do index.js:', err);
  }
});

/* ---------------------------
   FUNÇÃO: adicionar tarefa (Nova Tarefa)
   Salva na chave "kanbanTasks"
   --------------------------- */
function handleAddTask() {
  try {
    const tarefa = {
      titulo: (document.getElementById("titulo")?.value || '').trim(),
      id: (document.getElementById("taskId")?.value || '').trim(),
      prioridade: (document.getElementById("prioridade")?.value || '').trim(),
      abertoPor: (document.getElementById("abertoPor")?.value || '').trim(),
      responsavel: (document.getElementById("responsavel")?.value || '').trim(),
      status: (document.getElementById("status")?.value || '').trim(),
      descricao: (document.getElementById("descricao")?.value || '').trim()
    };

    if (!tarefa.titulo) {
      alert('Preencha o título da tarefa.');
      return;
    }

    const tasks = JSON.parse(localStorage.getItem('kanbanTasks')) || [];
    tasks.push(tarefa);
    localStorage.setItem('kanbanTasks', JSON.stringify(tasks));

    alert('Tarefa adicionada!');
    // volta para a página do Kanban (ajuste o caminho se necessário)
    window.location.href = 'index.html';
  } catch (err) {
    console.error('Erro ao adicionar tarefa:', err);
    alert('Erro ao adicionar tarefa. Veja console.');
  }
}

/* ---------------------------
   FUNÇÃO: carregar tarefas no Kanban
   --------------------------- */
function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem('kanbanTasks')) || [];
  console.log('loadTasks -> tarefas:', tasks.length);

  const colA = document.getElementById('colA');
  const colB = document.getElementById('colB');
  const colC = document.getElementById('colC');

  if (!colA || !colB || !colC) {
    console.warn('Colunas do Kanban não encontradas.');
    return;
  }

  // Limpa colunas (mantém h3)
  [colA, colB, colC].forEach(col => {
    Array.from(col.children).forEach(child => {
      if (child.tagName.toLowerCase() !== 'h3') child.remove();
    });
  });

  tasks.forEach((task, index) => {
    const card = document.createElement('div');
    card.className = 'task-card';
    card.dataset.index = index;

    card.innerHTML = `
      <div class="task-header"><strong>${escapeHtml(task.titulo)}</strong> <span class="task-priority">[${escapeHtml(task.prioridade || '')}]</span></div>
      <div>ID: ${escapeHtml(task.id || '')}</div>
      <div>Resp: ${escapeHtml(task.responsavel || '')}</div>
      <div class="task-desc">${escapeHtml(task.descricao || '')}</div>
    `;

    // abrir modal ao clicar
    card.addEventListener('click', () => openModal(index));

    // decidir coluna por status (comparações exatas)
    const status = (task.status || '').toLowerCase();
    if (status === 'a fazer' || status === 'pendente') {
      colA.appendChild(card);
    } else if (status === 'em andamento') {
      colB.appendChild(card);
    } else if (status === 'pronto' || status === 'concluída' || status === 'concluida') {
      colC.appendChild(card);
    } else {
      // fallback envia para A Fazer
      colA.appendChild(card);
    }
  });
}

/* ---------------------------
   FUNÇÕES DO MODAL: abrir, fechar, salvar, excluir
   --------------------------- */
function setupModalListeners() {
  const modal = document.getElementById('taskModal');
  if (!modal) {
    console.warn('Modal não encontrado (setupModalListeners).');
    return;
  }

  const closeBtn = document.querySelector('.closeBtn');
  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  // fechar clicando fora
  window.addEventListener('click', (e) => {
    if (e.target && e.target.id === 'taskModal') closeModal();
  });

  // salvar (botão salvar pode ou não existir na página dependendo do HTML)
  const btnSalvar = document.getElementById('btnSalvarEdicao');
  if (btnSalvar) {
    btnSalvar.addEventListener('click', () => {
      try {
        const tasks = JSON.parse(localStorage.getItem('kanbanTasks')) || [];
        if (editingIndex === null || typeof tasks[editingIndex] === 'undefined') {
          alert('Tarefa não encontrada para salvar.');
          return;
        }

        const t = tasks[editingIndex];
        t.titulo = (document.getElementById('modalTitulo')?.value || '').trim();
        t.responsavel = (document.getElementById('modalResponsavel')?.value || '').trim();
        t.status = (document.getElementById('modalStatus')?.value || '').trim();
        t.descricao = (document.getElementById('modalDescricao')?.value || '').trim();

        localStorage.setItem('kanbanTasks', JSON.stringify(tasks));
        closeModal();
        loadTasks();
        console.log('Tarefa salva index:', editingIndex);
      } catch (err) {
        console.error('Erro ao salvar edição:', err);
        alert('Erro ao salvar. Veja console.');
      }
    });
  }

  // excluir
  const btnExcluir = document.getElementById('btnExcluir');
  if (btnExcluir) {
    btnExcluir.addEventListener('click', () => {
      if (editingIndex === null) return;
      if (!confirm('Tem certeza que deseja excluir esta tarefa?')) return;
      const tasks = JSON.parse(localStorage.getItem('kanbanTasks')) || [];
      tasks.splice(editingIndex, 1);
      localStorage.setItem('kanbanTasks', JSON.stringify(tasks));
      closeModal();
      loadTasks();
      console.log('Tarefa excluída index:', editingIndex);
    });
  }
}

function openModal(index) {
  const tasks = JSON.parse(localStorage.getItem('kanbanTasks')) || [];
  const t = tasks[index];
  if (!t) { alert('Tarefa não encontrada.'); return; }
  editingIndex = index;

  // preencher campos (se existirem)
  const titleEl = document.getElementById('modalTitulo');
  const respEl = document.getElementById('modalResponsavel');
  const statusEl = document.getElementById('modalStatus');
  const descEl = document.getElementById('modalDescricao');

  if (titleEl) titleEl.value = t.titulo || '';
  if (respEl) respEl.value = t.responsavel || '';
  if (statusEl) {
    // tenta setar; se opção não existir, seleciona primeira
    try { statusEl.value = t.status || statusEl.options[0].value; } catch {}
  }
  if (descEl) descEl.value = t.descricao || '';

  const modal = document.getElementById('taskModal');
  if (modal) modal.style.display = 'flex';
}

function closeModal() {
  const modal = document.getElementById('taskModal');
  if (modal) modal.style.display = 'none';
  editingIndex = null;
}

/* util */
function escapeHtml(text) {
  if (!text) return '';
  return text.replace(/[&<>"'`=\/]/g, function (s) {
    return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;','/':'&#x2F;','`':'&#x60;','=':'&#x3D;'})[s];
  });
}
