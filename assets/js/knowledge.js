/* =====================================================
   Knowledge Studio - Page Script
   AI Capability Open Platform - Sprint 05
   ===================================================== */

let currentKnowledgeBase = null;
let currentDocuments = [];
let currentFilter = {
  keyword: '',
  status: '',
  format: ''
};
let selectedDocIds = new Set();

// 当前页签：documents | test
let currentTab = 'documents';
// 语义块预览：当前预览的文档 id（为 null 时显示文档列表）
let chunkPreviewDocId = null;

// 知识库列表分页
const KB_PAGE_SIZE = 5;
let kbSearchKeyword = '';
let kbPage = 1;

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', async () => {
  initHeaderDropdown();
  highlightActiveMenu();
  await loadKnowledgePage();
});

/**
 * Load and render the knowledge page
 */
async function loadKnowledgePage() {
  const data = await loadMockData('knowledge');
  if (!data) {
    document.getElementById('app-content').innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon"><i class="fa-solid fa-triangle-exclamation"></i></div>
        <div class="empty-state-title">数据加载失败</div>
        <div class="empty-state-desc">请检查Mock数据是否正确</div>
      </div>
    `;
    return;
  }

  // Store data globally
  window.knowledgeData = data;

  // Render all sections
  renderLifecycle(data.lifecycle);
  renderKnowledgeLibrary();

  // Select first knowledge base by default
  if (data.knowledgeBases.length > 0) {
    selectKnowledgeBase(data.knowledgeBases[0].id);
  }

  renderRAGTest(data.ragTest);
}

/**
 * Render knowledge lifecycle (悬浮弹层)
 */
function renderLifecycle(lifecycle) {
  const container = document.getElementById('lifecycle-popup');
  if (!container) return;

  container.innerHTML = `
    <div class="lifecycle-popup-title">
      <i class="fa-solid fa-sync"></i> 知识生命周期
    </div>
    <div class="lifecycle-steps">
      ${lifecycle.map(step => `
        <div class="lifecycle-step ${step.completed ? 'completed' : ''} ${step.active && !step.completed ? 'active' : ''}">
          <div class="lifecycle-icon"><i class="fa-solid ${step.icon}"></i></div>
          <div class="lifecycle-label">${step.stage}</div>
          <div class="lifecycle-desc">${step.desc}</div>
        </div>
      `).join('')}
    </div>
  `;
}

/* =====================================================
   知识库列表（左侧面板，带搜索 + 分页）
   ===================================================== */

/**
 * 获取过滤后的知识库列表
 */
function getFilteredKnowledgeBases() {
  const keyword = kbSearchKeyword.trim().toLowerCase();
  const list = window.knowledgeData?.knowledgeBases || [];
  if (!keyword) return list;
  return list.filter(kb =>
    kb.name.toLowerCase().includes(keyword) ||
    (kb.description || '').toLowerCase().includes(keyword)
  );
}

/**
 * Render knowledge library (left panel) - 当前页
 */
function renderKnowledgeLibrary() {
  const container = document.getElementById('knowledge-library-list');
  if (!container) return;

  const allCount = (window.knowledgeData?.knowledgeBases || []).length;
  const countEl = document.getElementById('knowledge-library-count');
  if (countEl) {
    countEl.textContent = `${allCount} 个知识库`;
  }

  const filtered = getFilteredKnowledgeBases();
  const totalPages = Math.max(1, Math.ceil(filtered.length / KB_PAGE_SIZE));
  if (kbPage > totalPages) kbPage = totalPages;

  const start = (kbPage - 1) * KB_PAGE_SIZE;
  const pageItems = filtered.slice(start, start + KB_PAGE_SIZE);

  if (pageItems.length === 0) {
    container.innerHTML = `
      <div class="empty-state" style="padding: 40px;">
        <div class="empty-state-icon"><i class="fa-solid fa-folder-open"></i></div>
        <div class="empty-state-title">暂无知识库</div>
        <div class="empty-state-desc">没有匹配的知识库</div>
      </div>
    `;
  } else {
    container.innerHTML = pageItems.map(kb => `
      <div class="library-item ${currentKnowledgeBase?.id === kb.id ? 'active' : ''}"
           data-id="${kb.id}" onclick="selectKnowledgeBase('${kb.id}')">
        <div class="library-item-header">
          <a href="knowledge-detail.html?id=${kb.id}" class="library-item-name" target="_parent" title="查看详情" onclick="event.stopPropagation()">
            ${kb.name} <i class="fa-solid fa-external-link-alt" style="font-size: 10px; opacity: 0.5;"></i>
          </a>
          <div class="library-item-actions">
            <button class="library-action-btn" onclick="event.stopPropagation(); editKnowledgeBase('${kb.id}')" title="编辑">
              <i class="fa-solid fa-pen"></i>
            </button>
            <button class="library-action-btn" onclick="event.stopPropagation(); deleteKnowledgeBase('${kb.id}')" title="删除">
              <i class="fa-solid fa-trash"></i>
            </button>
            <div class="library-item-status ${kb.status}"></div>
          </div>
        </div>
        <div class="library-item-desc">${kb.description}</div>
        <div class="library-item-meta">
          <span class="library-item-meta-item">
            <i class="fa-solid fa-file-alt"></i> ${formatNumber(kb.docCount)} 文档
          </span>
          <span class="library-item-meta-item">
            <i class="fa-solid fa-clock"></i> ${kb.lastSync}
          </span>
        </div>
      </div>
    `).join('');
  }

  renderKbPagination(filtered.length, totalPages);
}

/**
 * Render knowledge library pagination
 */
function renderKbPagination(total, totalPages) {
  const container = document.getElementById('kb-pagination');
  if (!container) return;

  if (total <= KB_PAGE_SIZE) {
    container.innerHTML = '';
    return;
  }

  const start = (kbPage - 1) * KB_PAGE_SIZE + 1;
  const end = Math.min(kbPage * KB_PAGE_SIZE, total);

  let pagesHtml = '';
  // 上一页
  pagesHtml += `<button class="page-btn" ${kbPage === 1 ? 'disabled' : ''} onclick="goToKbPage(${kbPage - 1})">
      <i class="fa-solid fa-chevron-left"></i>
    </button>`;
  // 页码
  for (let p = 1; p <= totalPages; p++) {
    pagesHtml += `<button class="page-btn ${p === kbPage ? 'active' : ''}" onclick="goToKbPage(${p})">${p}</button>`;
  }
  // 下一页
  pagesHtml += `<button class="page-btn" ${kbPage === totalPages ? 'disabled' : ''} onclick="goToKbPage(${kbPage + 1})">
      <i class="fa-solid fa-chevron-right"></i>
    </button>`;

  container.innerHTML = `
    <span class="page-info">${start}-${end} / 共 ${total}</span>
    <div class="page-buttons">${pagesHtml}</div>
  `;
}

/**
 * Go to a specific knowledge base page
 */
function goToKbPage(page) {
  const filtered = getFilteredKnowledgeBases();
  const totalPages = Math.max(1, Math.ceil(filtered.length / KB_PAGE_SIZE));
  if (page < 1 || page > totalPages) return;
  kbPage = page;
  renderKnowledgeLibrary();
}

/**
 * Handle knowledge base search
 */
function handleKbSearch() {
  kbSearchKeyword = document.getElementById('kb-search-input')?.value || '';
  kbPage = 1;
  renderKnowledgeLibrary();
}

/**
 * Select a knowledge base and render its documents
 */
function selectKnowledgeBase(kbId) {
  const kb = window.knowledgeData?.knowledgeBases?.find(k => k.id === kbId);
  if (!kb) return;

  currentKnowledgeBase = kb;
  chunkPreviewDocId = null;
  showDocTableView();

  // Update library selection UI
  document.querySelectorAll('.library-item').forEach(item => {
    item.classList.toggle('active', item.dataset.id === kbId);
  });

  // Update current knowledge base label
  const currentKbLabel = document.getElementById('current-kb-label');
  if (currentKbLabel) {
    currentKbLabel.textContent = kb.name;
  }

  // Filter documents for this knowledge base
  currentDocuments = window.knowledgeData?.documents?.filter(d => d.kbId === kbId) || [];

  // Reset selection
  selectedDocIds.clear();
  updateBatchDocActions();

  // Reset filters
  currentFilter = { keyword: '', status: '', format: '' };
  const si = document.getElementById('doc-search-input'); if (si) si.value = '';
  const sf = document.getElementById('doc-status-filter'); if (sf) sf.value = '';
  const ff = document.getElementById('doc-format-filter'); if (ff) ff.value = '';

  renderDocumentList();

  // Update RAG console KB label
  const ragKbLabel = document.getElementById('rag-kb-label');
  if (ragKbLabel) {
    ragKbLabel.textContent = `当前知识库：${kb.name}`;
  }
}

/**
 * Create knowledge base - navigate to create page
 */
function createKnowledgeBase() {
  window.location.href = 'knowledge-create.html';
}

/**
 * Import document - navigate to upload page
 */
function importDocument() {
  window.location.href = 'document-upload.html';
}

/**
 * Edit knowledge base - navigate to edit page
 */
function editKnowledgeBase(kbId) {
  window.location.href = 'knowledge-edit.html?id=' + kbId;
}

/**
 * Delete knowledge base with confirmation
 */
function deleteKnowledgeBase(kbId) {
  const kb = window.knowledgeData?.knowledgeBases?.find(k => k.id === kbId);
  if (!kb) return;

  if (confirm('确定要删除知识库「' + kb.name + '」吗？\n\n此操作将同时删除知识库中的所有文档，且不可恢复。')) {
    // Remove from local data
    window.knowledgeData.knowledgeBases = window.knowledgeData.knowledgeBases.filter(k => k.id !== kbId);

    // Re-render library
    renderKnowledgeLibrary();

    // If deleted the currently selected KB, select the first one
    if (currentKnowledgeBase?.id === kbId) {
      if (window.knowledgeData.knowledgeBases.length > 0) {
        selectKnowledgeBase(window.knowledgeData.knowledgeBases[0].id);
      } else {
        currentKnowledgeBase = null;
        currentDocuments = [];
        renderDocumentList();
        const currentKbLabel = document.getElementById('current-kb-label');
        if (currentKbLabel) currentKbLabel.textContent = '选择知识库';
      }
    }

    showToast('已删除知识库：' + kb.name, 'success');
  }
}

/* =====================================================
   页签切换：文档管理 / 知识测试控制台
   ===================================================== */

function switchTab(tab) {
  currentTab = tab;
  document.getElementById('tab-documents').classList.toggle('active', tab === 'documents');
  document.getElementById('tab-test').classList.toggle('active', tab === 'test');
  document.getElementById('pane-documents').classList.toggle('active', tab === 'documents');
  document.getElementById('pane-test').classList.toggle('active', tab === 'test');

  // 切到测试控制台时刷新知识库标签
  if (tab === 'test') {
    const ragKbLabel = document.getElementById('rag-kb-label');
    if (ragKbLabel) {
      ragKbLabel.textContent = currentKnowledgeBase
        ? `当前知识库：${currentKnowledgeBase.name}`
        : '请先选择知识库';
    }
  }
}

/* =====================================================
   文档管理（表格）
   ===================================================== */

/**
 * Toggle document selection
 */
function toggleDocSelect(docId) {
  if (selectedDocIds.has(docId)) {
    selectedDocIds.delete(docId);
  } else {
    selectedDocIds.add(docId);
  }
  updateBatchDocActions();
}

/**
 * Toggle select all documents
 */
function toggleAllDocSelect() {
  const selectAll = document.getElementById('doc-select-all');
  if (selectAll.checked) {
    currentDocuments.forEach(doc => selectedDocIds.add(doc.id));
  } else {
    selectedDocIds.clear();
  }
  renderDocumentList();
  updateBatchDocActions();
}

/**
 * Update batch document actions visibility
 */
function updateBatchDocActions() {
  const batchActions = document.getElementById('batch-doc-actions');
  const countEl = document.getElementById('batch-doc-count');

  if (batchActions) {
    if (selectedDocIds.size > 0) {
      batchActions.style.display = 'flex';
      countEl.textContent = selectedDocIds.size;
    } else {
      batchActions.style.display = 'none';
    }
  }
}

/**
 * Batch reparse selected documents
 */
function batchReparseDocs() {
  if (selectedDocIds.size === 0) {
    showToast('请先选择要重新解析的文档', 'info');
    return;
  }

  currentDocuments.forEach(doc => {
    if (selectedDocIds.has(doc.id)) {
      doc.parseStatus = 'processing';
      doc.embeddingStatus = 'pending';
    }
  });

  renderDocumentList();
  showToast('已提交 ' + selectedDocIds.size + ' 个文档的重新解析任务', 'success');
  selectedDocIds.clear();
  updateBatchDocActions();
}

/**
 * Batch delete selected documents
 */
function batchDeleteDocs() {
  if (selectedDocIds.size === 0) {
    showToast('请先选择要删除的文档', 'info');
    return;
  }

  if (confirm('确定要删除选中的 ' + selectedDocIds.size + ' 个文档吗？此操作不可恢复。')) {
    const count = selectedDocIds.size;

    currentDocuments = currentDocuments.filter(doc => !selectedDocIds.has(doc.id));

    if (window.knowledgeData?.documents) {
      window.knowledgeData.documents = window.knowledgeData.documents.filter(doc => !selectedDocIds.has(doc.id));
    }

    selectedDocIds.clear();
    renderDocumentList();
    updateBatchDocActions();
    showToast('已删除 ' + count + ' 个文档', 'success');
  }
}

/**
 * Render document list (right panel)
 */
function renderDocumentList() {
  const container = document.getElementById('document-table-body');
  if (!container) return;

  // Apply filters
  let filteredDocs = currentDocuments.filter(doc => {
    if (currentFilter.keyword) {
      if (!doc.name.toLowerCase().includes(currentFilter.keyword.toLowerCase())) {
        return false;
      }
    }
    if (currentFilter.status && doc.embeddingStatus !== currentFilter.status) {
      return false;
    }
    if (currentFilter.format && doc.format !== currentFilter.format) {
      return false;
    }
    return true;
  });

  if (filteredDocs.length === 0) {
    container.innerHTML = `
      <tr>
        <td colspan="8" class="empty-state" style="padding: 40px;">
          <div class="empty-state-icon"><i class="fa-solid fa-folder-open"></i></div>
          <div class="empty-state-title">暂无文档</div>
          <div class="empty-state-desc">该知识库下没有文档</div>
        </td>
      </tr>
    `;
    return;
  }

  container.innerHTML = filteredDocs.map(doc => `
    <tr>
      <td onclick="event.stopPropagation()">
        <input type="checkbox" class="doc-checkbox" value="${doc.id}"
               ${selectedDocIds.has(doc.id) ? 'checked' : ''}
               onchange="toggleDocSelect('${doc.id}')">
      </td>
      <td onclick="openChunkPreview('${doc.id}')">
        <div class="document-name" title="${doc.name}">${doc.name}</div>
      </td>
      <td onclick="openChunkPreview('${doc.id}')"><span class="document-format ${doc.format.toLowerCase()}">${doc.format}</span></td>
      <td onclick="openChunkPreview('${doc.id}')">${doc.size}</td>
      <td><span class="status-tag ${doc.parseStatus}">${getParseStatusText(doc.parseStatus)}</span></td>
      <td><span class="status-tag ${doc.embeddingStatus}">${getEmbeddingStatusText(doc.embeddingStatus)}</span></td>
      <td>${doc.updatedAt}</td>
      <td>
        <div class="table-operations" onclick="event.stopPropagation()">
          <button class="chunk-preview-btn" onclick="openChunkPreview('${doc.id}')" title="语义块预览">
            <i class="fa-solid fa-layer-group"></i> 语义块 <span class="op-count">${doc.chunkCount}</span>
          </button>
          <button class="btn btn-ghost btn-sm" onclick="reparseDocument('${doc.id}')" title="重新解析">
            <i class="fa-solid fa-rotate-right"></i>
          </button>
          <button class="btn btn-ghost btn-sm" onclick="deleteDocument('${doc.id}')" title="删除">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
      </td>
    </tr>
  `).join('');
}

/**
 * Reparse document
 */
function reparseDocument(docId) {
  const doc = currentDocuments.find(d => d.id === docId);
  if (!doc) return;

  showToast(`重新解析文档: ${doc.name}`, 'info');

  setTimeout(() => {
    doc.parseStatus = 'processing';
    doc.embeddingStatus = 'pending';
    renderDocumentList();
    showToast('文档重新解析中...', 'success');
  }, 500);
}

/**
 * Delete document
 */
function deleteDocument(docId) {
  const doc = currentDocuments.find(d => d.id === docId);
  if (!doc) return;

  if (confirm(`确定要删除文档"${doc.name}"吗？此操作不可恢复。`)) {
    showToast(`已删除文档: ${doc.name}`, 'success');
    currentDocuments = currentDocuments.filter(d => d.id !== docId);
    if (window.knowledgeData?.documents) {
      window.knowledgeData.documents = window.knowledgeData.documents.filter(d => d.id !== docId);
    }
    renderDocumentList();
  }
}

/* =====================================================
   语义块预览（页面形式 + 抽屉详情）
   ===================================================== */

/**
 * 切换显示：文档列表视图
 */
function showDocTableView() {
  document.getElementById('doc-table-view').style.display = '';
  document.getElementById('chunk-preview-view').style.display = 'none';
}

/**
 * 切换显示：语义块预览视图
 */
function showChunkPreviewView() {
  document.getElementById('doc-table-view').style.display = 'none';
  document.getElementById('chunk-preview-view').style.display = '';
}

/**
 * 打开语义块预览（页面形式）
 */
function openChunkPreview(docId) {
  const doc = window.knowledgeData?.documents?.find(d => d.id === docId);
  if (!doc) return;

  chunkPreviewDocId = docId;

  const titleEl = document.getElementById('chunk-preview-title');
  if (titleEl) {
    titleEl.innerHTML = `
      <i class="fa-solid fa-layer-group"></i>
      <span>${doc.name} · 语义块预览</span>
    `;
  }

  const chunks = (window.knowledgeData?.chunks || []).filter(c => c.docId === docId);
  const listEl = document.getElementById('chunk-preview-list');

  if (chunks.length === 0) {
    listEl.innerHTML = `
      <div class="empty-state" style="padding: 60px;">
        <div class="empty-state-icon"><i class="fa-solid fa-layer-group"></i></div>
        <div class="empty-state-title">暂无语义块</div>
        <div class="empty-state-desc">该文档尚未切分语义块</div>
      </div>
    `;
  } else {
    listEl.innerHTML = chunks.map(chunk => `
      <div class="chunk-preview-item" onclick="viewChunkDetail('${chunk.id}')">
        <div class="chunk-preview-item-header">
          <span class="chunk-preview-item-id">语义块 ${chunk.index}</span>
          <span class="chunk-preview-item-token">${chunk.tokenCount} tokens</span>
          <span class="chunk-item-badge ${chunk.embeddingStatus}">${getEmbeddingStatusText(chunk.embeddingStatus)}</span>
        </div>
        <div class="chunk-preview-item-content">${escapeHtml(chunk.content)}</div>
        <div class="chunk-preview-item-meta">
          <span><i class="fa-solid fa-font"></i> ${chunk.length} 字符</span>
          <span><i class="fa-solid fa-link"></i> 引用 ${chunk['引用次数']} 次</span>
          <span class="chunk-preview-item-more">查看详情 <i class="fa-solid fa-chevron-right"></i></span>
        </div>
      </div>
    `).join('');
  }

  showChunkPreviewView();
}

/**
 * 返回文档列表
 */
function backToDocList() {
  chunkPreviewDocId = null;
  showDocTableView();
}

/**
 * 查看语义块详情（右侧抽屉）
 */
function viewChunkDetail(chunkId) {
  const chunk = window.knowledgeData?.chunks?.find(c => c.id === chunkId);
  const detailEl = document.getElementById('drawer-body');
  const titleEl = document.getElementById('drawer-title');
  if (!chunk || !detailEl) return;

  // 列表选中态
  document.querySelectorAll('.chunk-preview-item').forEach(item => item.classList.remove('active'));
  const activeItem = document.querySelector(`.chunk-preview-item[onclick="viewChunkDetail('${chunkId}')"]`);
  if (activeItem) activeItem.classList.add('active');

  if (titleEl) titleEl.textContent = `语义块 ${chunk.index} 详情`;

  detailEl.innerHTML = `
    <div class="chunk-detail-header">
      <div class="chunk-detail-title">
        <i class="fa-solid fa-file-contract"></i>
        语义块 ${chunk.index}
      </div>
      <span class="chunk-item-badge ${chunk.embeddingStatus}">${getEmbeddingStatusText(chunk.embeddingStatus)}</span>
    </div>
    <div class="chunk-detail-meta">
      <div class="chunk-meta-item">
        <span class="chunk-meta-label">Token</span>
        <span class="chunk-meta-value">${chunk.tokenCount}</span>
      </div>
      <div class="chunk-meta-item">
        <span class="chunk-meta-label">字符长度</span>
        <span class="chunk-meta-value">${chunk.length}</span>
      </div>
      <div class="chunk-meta-item">
        <span class="chunk-meta-label">引用次数</span>
        <span class="chunk-meta-value">${chunk['引用次数']}</span>
      </div>
    </div>
    <div class="chunk-detail-section">
      <div class="chunk-detail-section-title">内容</div>
      <div class="chunk-detail-content">${escapeHtml(chunk.content)}</div>
    </div>
    <div class="chunk-detail-section">
      <div class="chunk-detail-section-title">时间戳</div>
      <div class="chunk-detail-timestamp">${chunk.updatedAt || '2024-01-15 10:30:00'}</div>
    </div>
  `;

  openDrawer();
}

/**
 * Open drawer
 */
function openDrawer() {
  const drawer = document.getElementById('drawer');
  const overlay = document.getElementById('drawer-overlay');
  overlay?.classList.add('show');
  drawer?.classList.add('show');
}

/**
 * Close drawer
 */
function closeDrawer() {
  const drawer = document.getElementById('drawer');
  const overlay = document.getElementById('drawer-overlay');
  drawer?.classList.remove('show');
  overlay?.classList.remove('show');
}

/* =====================================================
   知识测试控制台 (RAG)
   ===================================================== */

/**
 * Render RAG Test Console
 */
function renderRAGTest(ragTest) {
  const questionInput = document.getElementById('rag-question');
  const topkSelect = document.getElementById('rag-topk');
  const thresholdInput = document.getElementById('rag-threshold');
  const resultsContainer = document.getElementById('rag-results');
  const answerContent = document.getElementById('rag-answer-content');

  if (questionInput) questionInput.value = ragTest.question;
  if (topkSelect) topkSelect.value = ragTest.topK;
  if (thresholdInput) thresholdInput.value = ragTest.scoreThreshold;

  if (resultsContainer) {
    resultsContainer.innerHTML = ragTest.results.map(result => `
      <div class="rag-result-item">
        <div class="rag-result-header">
          <span class="rag-result-doc">${result.docName}</span>
          <span class="rag-result-score">${(result.score * 100).toFixed(0)}%</span>
        </div>
        <div class="rag-result-meta">语义块 ${result.chunkIndex} · 命中</div>
        <div class="rag-result-content">${result.content}</div>
      </div>
    `).join('');
  }

  if (answerContent) {
    answerContent.innerHTML = ragTest.answer.split('\n').map(line => {
      if (line.startsWith('1.') || line.startsWith('2.') || line.startsWith('3.') || line.startsWith('4.')) {
        return `<p><strong>${line}</strong></p>`;
      }
      return `<p>${line}</p>`;
    }).join('');
  }
}

/**
 * Perform RAG test search
 */
function performRAGSearch() {
  const question = document.getElementById('rag-question')?.value;
  if (!question) {
    showToast('请输入检索问题', 'error');
    return;
  }

  if (!currentKnowledgeBase) {
    showToast('请先选择知识库', 'error');
    return;
  }

  showToast('正在检索...', 'info');

  setTimeout(() => {
    const ragTest = window.knowledgeData?.ragTest;
    if (ragTest) {
      renderRAGTest(ragTest);
    }
    showToast('检索完成', 'success');
  }, 800);
}

/* =====================================================
   工具函数
   ===================================================== */

/**
 * Handle document filter changes
 */
function handleDocFilterChange() {
  currentFilter.keyword = document.getElementById('doc-search-input')?.value || '';
  currentFilter.status = document.getElementById('doc-status-filter')?.value || '';
  currentFilter.format = document.getElementById('doc-format-filter')?.value || '';

  renderDocumentList();
}

/**
 * Reset document filters
 */
function resetDocFilters() {
  currentFilter = { keyword: '', status: '', format: '' };

  const searchInput = document.getElementById('doc-search-input');
  const statusFilter = document.getElementById('doc-status-filter');
  const formatFilter = document.getElementById('doc-format-filter');

  if (searchInput) searchInput.value = '';
  if (statusFilter) statusFilter.value = '';
  if (formatFilter) formatFilter.value = '';

  renderDocumentList();
}

/**
 * Get parse status display text
 */
function getParseStatusText(status) {
  const statusMap = {
    'completed': '已完成',
    'processing': '处理中',
    'failed': '失败',
    'pending': '等待中'
  };
  return statusMap[status] || status;
}

/**
 * Get embedding status display text
 */
function getEmbeddingStatusText(status) {
  const statusMap = {
    'completed': '已完成',
    'processing': '处理中',
    'failed': '失败',
    'pending': '等待中'
  };
  return statusMap[status] || status;
}

/**
 * Format number with thousands separator
 */
function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Show toast notification
 */
function showToast(message, type = 'info') {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <i class="fa-solid ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-times-circle' : 'fa-info-circle'}"></i>
    <span>${message}</span>
  `;
  document.body.appendChild(toast);

  setTimeout(() => toast.classList.add('show'), 10);
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}

/**
 * Initialize header dropdown
 */
function initHeaderDropdown() {
  const userEl = document.querySelector('.header-user');
  if (!userEl) return;

  userEl.addEventListener('click', () => {
    userEl.classList.toggle('show');
  });

  document.addEventListener('click', (e) => {
    if (!userEl.contains(e.target)) {
      userEl.classList.remove('show');
    }
  });
}

/**
 * Highlight active menu item
 */
function highlightActiveMenu() {
  const currentPage = window.location.pathname.split('/').pop() || 'knowledge.html';
  document.querySelectorAll('.sidebar-item').forEach(item => {
    const href = item.getAttribute('href');
    if (href && href.includes('knowledge')) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });
}

// Drawer close handlers
document.addEventListener('DOMContentLoaded', () => {
  const closeBtn = document.getElementById('drawer-close');
  const overlay = document.getElementById('drawer-overlay');
  closeBtn?.addEventListener('click', closeDrawer);
  overlay?.addEventListener('click', closeDrawer);
});
