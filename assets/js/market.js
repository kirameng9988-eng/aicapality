/* =====================================================
   AI Capability Marketplace - JavaScript
   Enterprise AI Marketplace Interactions
   ===================================================== */

const Market = {
  // State
  currentCategory: 'all',
  searchQuery: '',
  currentTab: 'guessYouLike',
  selectedCapability: null,
  currentMainTab: 'featured', // 'featured' | 'all'

  // Pagination
  currentPage: 1,
  pageSize: 9,
  totalCount: 0,

  // Filters
  filterType: '',
  filterCategory: '',
  filterSort: 'hot',

  // User data
  favorites: [],
  applications: [],

  // DOM Elements
  elements: {},

  // Initialize
  init() {
    this.loadMockData();
    this.cacheElements();
    this.bindEvents();
    this.render();
  },

  // Cache DOM elements
  cacheElements() {
    this.elements = {
      featuredCarousel: document.getElementById('featured-carousel'),
      categoryNav: document.getElementById('category-nav'),
      searchInput: document.getElementById('search-input'),
      capabilityGrid: document.getElementById('capability-grid'),
      integrationGrid: document.getElementById('integration-grid'),
      recommendTabs: document.getElementById('recommend-tabs'),
      recommendGrid: document.getElementById('recommend-grid'),
      detailDrawer: document.getElementById('detail-drawer'),
      detailDrawerOverlay: document.getElementById('detail-drawer-overlay'),
      experienceModalOverlay: document.getElementById('experience-modal-overlay'),
      applyModalOverlay: document.getElementById('apply-modal-overlay'),
      myApplicationsOverlay: document.getElementById('my-applications-overlay'),
      myFavoritesOverlay: document.getElementById('my-favorites-overlay'),
      paginationContainer: document.getElementById('pagination-container'),
      capabilityCount: document.getElementById('capability-count'),
      overviewGrid: document.getElementById('market-overview-grid'),
      filterType: document.getElementById('filter-type'),
      filterCategory: document.getElementById('filter-category'),
      filterSort: document.getElementById('filter-sort'),
      featuredGrid: document.getElementById('featured-grid'),
      featuredView: document.getElementById('featured-view'),
      allView: document.getElementById('all-view'),
      guideFlow: document.getElementById('guide-flow')
    };
  },

  // Load mock data
  loadMockData() {
    this.data = getMockDataSync('market') || MockData.market;

    // 能力主数据 = 已上架 Agent(Agent 即能力)
    const published = (typeof AgentStore !== 'undefined')
      ? AgentStore.list().filter(a => a.status === 'published')
      : [];
    this.agentItems = published.map(a => this.agentToCapability(a));
    this.data.capabilities = this.agentItems;
    this.data.featured = this.agentItems.slice().sort((x, y) => (y.calls || 0) - (x.calls || 0)).slice(0, 6);
    const byCat = {};
    this.agentItems.forEach(c => { const k = c.category || '其他'; byCat[k] = (byCat[k] || 0) + 1; });
    this.data.categories = Object.keys(byCat).map(n => ({ id: n, name: n, count: byCat[n], icon: 'fa-tag' }));

    // 申请记录统一来自 ApplyStore
    this.applications = (typeof ApplyStore !== 'undefined') ? ApplyStore.list() : [];
  },

  // Agent -> 市场卡片对象
  agentToCapability(a) {
    const catColor = {
      '数据治理': '#4F46E5', '数据分析': '#0EA5E9', '数据运营': '#F59E0B',
      '业务服务': '#10B981', '通用助手': '#8B5CF6'
    };
    return {
      id: a.id,
      name: a.name,
      description: a.description || a.roleName || '',
      category: a.category || '通用助手',
      type: 'Agent',
      version: String(a.version || 'v1.0').replace(/^v/, ''),
      calls: a.calls || a.usageCount || 0,
      rating: a.rating || 4.5,
      reviews: a.reviews || 0,
      owner: a.creator || '平台',
      provider: a.creator || '平台',
      tags: [],
      icon: 'fa-robot',
      color: catColor[a.category] || '#4F46E5',
      updatedAt: (a.updatedAt || '').slice(0, 10),
      protocols: a.protocols || ['MCP', 'OpenAPI', 'SDK'],
      detail: {
        protocols: a.protocols || ['MCP', 'OpenAPI', 'SDK'],
        models: a.model ? [String(a.model)] : [],
        knowledgeBases: (a.knowledgeBases || []).slice(0, 3),
        skills: (a.skills || []).slice(0, 3),
        example: '输入自然语言任务,由该 Agent 完成对应岗位工作。',
        inputParams: [],
        outputParams: [],
        docsUrl: ''
      },
      agentId: a.id,
      agentName: a.name
    };
  },

  // Bind events
  bindEvents() {
    // Search with Enter key
    const searchInput = this.elements.searchInput;
    if (searchInput) {
      searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          this.handleSearch();
        }
      });
    }

    // Recommend tabs
    const recommendTabs = this.elements.recommendTabs;
    if (recommendTabs) {
      recommendTabs.addEventListener('click', (e) => {
        const tab = e.target.closest('.recommend-tab');
        if (tab) {
          this.handleTabChange(tab.dataset.tab);
        }
      });
    }

    // Detail drawer overlay close
    const detailOverlay = this.elements.detailDrawerOverlay;
    if (detailOverlay) {
      detailOverlay.addEventListener('click', () => this.closeDetailDrawer());
    }

    // Experience modal overlay close
    const expOverlay = this.elements.experienceModalOverlay;
    if (expOverlay) {
      expOverlay.addEventListener('click', (e) => {
        if (e.target === expOverlay) {
          this.closeExperienceModal();
        }
      });
    }

    // Apply modal overlay close
    const applyOverlay = this.elements.applyModalOverlay;
    if (applyOverlay) {
      applyOverlay.addEventListener('click', (e) => {
        if (e.target === applyOverlay) {
          this.closeApplyModal();
        }
      });
    }

    // My Applications modal overlay close
    const myAppsOverlay = this.elements.myApplicationsOverlay;
    if (myAppsOverlay) {
      myAppsOverlay.addEventListener('click', (e) => {
        if (e.target === myAppsOverlay) {
          this.closeMyApplications();
        }
      });
    }

    // My Favorites modal overlay close
    const myFavOverlay = this.elements.myFavoritesOverlay;
    if (myFavOverlay) {
      myFavOverlay.addEventListener('click', (e) => {
        if (e.target === myFavOverlay) {
          this.closeMyFavorites();
        }
      });
    }

    // Global keyboard events
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeAllModals();
      }
    });

    // Main tab switcher (热门能力 / 全部能力)
    document.querySelectorAll('.market-main-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        const tabName = tab.dataset.tab;
        this.switchMainTab(tabName);
      });
    });

    // Listen for messages from parent page (index.html breadcrumb links)
    window.addEventListener('message', (e) => {
      if (e.data?.type === 'openMyApplications') {
        this.openMyApplications();
      } else if (e.data?.type === 'openMyFavorites') {
        this.openMyFavorites();
      }
    });
  },

  // Render all sections
  render() {
    this.renderFeaturedGrid();
    this.renderGuide();
    this.renderCapabilities();
  },

  // Render Overview Stats
  renderOverview() {
    const container = this.elements.overviewGrid;
    if (!container || !this.data.capabilities) return;

    const totalCaps = this.data.capabilities.length;
    const totalCats = this.data.categories ? this.data.categories.length : 0;
    const totalCalls = this.data.capabilities.reduce((sum, cap) => sum + (cap.calls || 0), 0);
    const totalApps = this.applications.length;

    const stats = [
      { key: 'total', label: 'AI能力总数', value: totalCaps, icon: 'fa-cube', color: '#4F46E5' },
      { key: 'categories', label: '能力分类', value: totalCats, icon: 'fa-folder-tree', color: '#10B981' },
      { key: 'calls', label: '总调用次数', value: this.formatNumber(totalCalls), icon: 'fa-chart-line', color: '#F59E0B' },
      { key: 'applications', label: '我的申请', value: totalApps, icon: 'fa-file-alt', color: '#8B5CF6' }
    ];

    container.innerHTML = stats.map(stat => `
      <div class="market-overview-card ${stat.key}">
        <div class="market-overview-icon ${stat.key}" style="background: ${stat.color}20; color: ${stat.color}">
          <i class="fa-solid ${stat.icon}"></i>
        </div>
        <div class="market-overview-content">
          <div class="market-overview-label">${stat.label}</div>
          <div class="market-overview-value">${stat.value}</div>
        </div>
      </div>
    `).join('');
  },

  // Render Featured Grid (3-per-row, centered)
  renderFeaturedGrid() {
    const container = this.elements.featuredGrid;
    if (!container || !this.data.featured) return;

    container.innerHTML = this.data.featured.map(item => `
      <div class="featured-card" data-id="${item.id}" style="--card-accent-color: ${item.color}">
        <div class="card-hover-actions">
          <button class="card-hover-btn apply" onclick="event.stopPropagation(); Market.openApplyModalFromCard('${item.id}')">申请使用</button>
          <button class="card-hover-btn experience" onclick="event.stopPropagation(); Market.openExperiencePage('${item.id}')">立即体验</button>
        </div>
        <div class="featured-card-header">
          <div class="featured-card-icon" style="background: ${item.color}">
            <i class="fa-solid ${item.icon}"></i>
          </div>
          <div class="featured-card-info">
            <div class="featured-card-name">
              ${item.name}
              <span class="capability-type-badge">${item.type || 'Prompt'}</span>
            </div>
            <div class="featured-card-category">
              <i class="fa-solid fa-tag"></i>
              ${item.category}
            </div>
          </div>
        </div>
        <div class="featured-card-desc">${item.description}</div>
        <div class="featured-card-tags">
          ${item.tags.slice(0, 3).map(tag => `<span class="featured-card-tag">${tag}</span>`).join('')}
        </div>
        <div class="featured-card-footer">
          <div class="featured-card-stats">
            <div class="featured-card-stat">
              <i class="fa-solid fa-arrow-up-right"></i>
              ${this.formatNumber(item.calls)}次
            </div>
            <div class="featured-card-stat">
              <i class="fa-solid fa-user"></i>
              ${item.provider}
            </div>
          </div>
        </div>
      </div>
    `).join('');

    // Bind click events - open detail drawer
    container.querySelectorAll('.featured-card').forEach(card => {
      card.addEventListener('click', () => {
        this.openDetailDrawer(card.dataset.id);
      });
    });

    // Bind click events
    container.querySelectorAll('.featured-card').forEach(card => {
      card.addEventListener('click', () => {
        this.openDetailDrawer(card.dataset.id);
      });
    });
  },

  // Render 操作指引图
  renderGuide() {
    const container = this.elements.guideFlow;
    if (!container) return;

    const steps = [
      {
        icon: 'fa-magnifying-glass',
        bgClass: 'bg-indigo',
        num: '1',
        title: '浏览能力',
        desc: '在能力市场浏览各类AI能力，了解功能与适用场景'
      },
      {
        icon: 'fa-file-alt',
        bgClass: 'bg-cyan',
        num: '2',
        title: '申请使用',
        desc: '找到需要的能力后，提交使用申请并填写应用信息'
      },
      {
        icon: 'fa-plug',
        bgClass: 'bg-green',
        num: '3',
        title: '接入集成',
        desc: '审批通过后，通过MCP/Open API/SDK将能力接入应用'
      },
      {
        icon: 'fa-bolt',
        bgClass: 'bg-amber',
        num: '4',
        title: '在线体验',
        desc: '在能力详情页直接体验能力效果，确认满足需求'
      }
    ];

    container.innerHTML = steps.map(step => `
      <div class="guide-step">
        <div class="guide-step-icon-wrap">
          <div class="guide-step-number">${step.num}</div>
          <div class="guide-step-icon ${step.bgClass}">
            <i class="fa-solid ${step.icon}"></i>
          </div>
        </div>
        <div class="guide-step-title">${step.title}</div>
        <div class="guide-step-desc">${step.desc}</div>
        <div class="guide-step-connector"></div>
      </div>
    `).join('');
  },

  // Render Categories (for filter dropdown)
  renderCategories() {
    const container = this.elements.categoryNav;
    const filterCategory = this.elements.filterCategory;
    const byCategory = {};
    (this.data.capabilities || []).forEach(c => {
      const key = c.category || '其他';
      byCategory[key] = (byCategory[key] || 0) + 1;
    });
    const cats = Object.keys(byCategory);
    if (filterCategory) {
      filterCategory.innerHTML = '<option value="">全部分类</option>' +
        cats.map(name => `<option value="${name}">${name}</option>`).join('');
    }
    if (container) {
      container.innerHTML = `
        <div class="category-item ${this.currentCategory === 'all' ? 'active' : ''}" data-id="all">
          <i class="fa-solid fa-border-all"></i>
          <span>全部</span>
        </div>
      ` + cats.map(name => `
        <div class="category-item ${this.currentCategory === name ? 'active' : ''}" data-id="${name}">
          <i class="fa-solid fa-tag"></i>
          <span>${name}</span>
          <span class="count">${byCategory[name]}</span>
        </div>
      `).join('');

      // Bind click events
      container.querySelectorAll('.category-item').forEach(item => {
        item.addEventListener('click', () => {
          this.handleCategoryChange(item.dataset.id);
        });
      });
    }
  },

  // Render Capabilities Grid
  renderCapabilities() {
    const container = this.elements.capabilityGrid;
    if (!container || !this.data.capabilities) return;

    let filtered = [...this.data.capabilities];

    // Filter by category (业务域文本)
    if (this.currentCategory !== 'all') {
      filtered = filtered.filter(cap => (cap.category || '其他') === this.currentCategory);
    }

    // Filter by category dropdown
    if (this.filterCategory) {
      filtered = filtered.filter(cap => (cap.category || '其他') === this.filterCategory);
    }

    // Filter by search query
    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(cap =>
        cap.name.toLowerCase().includes(query) ||
        cap.description.toLowerCase().includes(query) ||
        cap.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Sort
    filtered = this.sortCapabilities(filtered);

    // Update total count
    this.totalCount = filtered.length;

    // Update count display
    if (this.elements.capabilityCount) {
      this.elements.capabilityCount.innerHTML = `共 <strong>${this.totalCount}</strong> 个能力`;
    }

    // Paginate
    const start = (this.currentPage - 1) * this.pageSize;
    const paged = filtered.slice(start, start + this.pageSize);

    if (paged.length === 0) {
      container.innerHTML = `
        <div class="market-empty">
          <div class="market-empty-icon">
            <i class="fa-solid fa-search"></i>
          </div>
          <div class="market-empty-title">未找到匹配的能力</div>
          <div class="market-empty-desc">尝试调整搜索条件或浏览其他分类</div>
        </div>
      `;
      this.elements.paginationContainer.innerHTML = '';
      return;
    }

    container.innerHTML = paged.map(cap => {
      const isFavorited = this.favorites.includes(cap.id);
      return `
      <div class="capability-card" data-id="${cap.id}">
        <div class="capability-card-header">
          <div class="capability-card-icon" style="background: ${cap.color}">
            <i class="fa-solid ${cap.icon}"></i>
          </div>
          <div class="capability-card-info">
            <div class="capability-card-name">
              ${cap.name}
              <span class="capability-card-type">${cap.type}</span>
            </div>
            <div class="capability-card-category">${cap.category}</div>
          </div>
          <button class="capability-favorite-btn ${isFavorited ? 'favorited' : ''}" onclick="event.stopPropagation(); Market.toggleFavorite('${cap.id}')">
            <i class="fa-solid fa-heart"></i>
          </button>
        </div>
        <div class="capability-card-desc">${cap.description}</div>
        <div class="capability-card-tags">
          ${cap.tags.slice(0, 3).map(tag => `<span class="capability-card-tag">${tag}</span>`).join('')}
        </div>
        <div class="capability-card-meta">
          <div class="capability-card-meta-item">
            <i class="fa-solid fa-arrow-up-right"></i>
            ${this.formatNumber(cap.calls)}次
          </div>
          <div class="capability-card-meta-item">
            <i class="fa-solid fa-user"></i>
            ${cap.owner}
          </div>
          <div class="capability-card-meta-item">
            <i class="fa-solid fa-clock"></i>
            ${cap.updatedAt}
          </div>
          <div class="capability-card-meta-item">
            <i class="fa-solid fa-code"></i>
            v${cap.version}
          </div>
        </div>
        <div class="capability-card-footer">
          <div></div>
          <div class="capability-card-actions">
            <button class="capability-card-btn secondary" onclick="event.stopPropagation(); Market.openDetailDrawer('${cap.id}')">查看详情</button>
            <button class="capability-card-btn primary" onclick="event.stopPropagation(); Market.openExperiencePage('${cap.id}')">立即体验</button>
          </div>
        </div>
      </div>
    `}).join('');

    // Bind click events for cards
    container.querySelectorAll('.capability-card').forEach(card => {
      card.addEventListener('click', () => {
        this.openDetailDrawer(card.dataset.id);
      });
    });

    // Render pagination
    this.renderPagination();
  },

  // Sort capabilities
  sortCapabilities(capabilities) {
    switch (this.filterSort) {
      case 'newest':
        return capabilities.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
      case 'rating':
        return capabilities.sort((a, b) => b.rating - a.rating);
      case 'calls':
        return capabilities.sort((a, b) => (b.calls || 0) - (a.calls || 0));
      case 'hot':
      default:
        return capabilities.sort((a, b) => (b.rating * 0.3 + (b.calls || 0) * 0.001) - (a.rating * 0.3 + (a.calls || 0) * 0.001));
    }
  },

  // Render Pagination
  renderPagination() {
    const container = this.elements.paginationContainer;
    if (!container) return;

    const totalPages = Math.ceil(this.totalCount / this.pageSize);
    if (totalPages <= 1) {
      container.innerHTML = '';
      return;
    }

    let html = '';

    // Previous button
    html += `<button class="pagination-btn" ${this.currentPage === 1 ? 'disabled' : ''} onclick="Market.goToPage(${this.currentPage - 1})">
      <i class="fa-solid fa-chevron-left"></i>
    </button>`;

    // Page numbers
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        html += `<button class="pagination-btn ${i === this.currentPage ? 'active' : ''}" onclick="Market.goToPage(${i})">${i}</button>`;
      }
    } else {
      // Always show first page
      html += `<button class="pagination-btn ${1 === this.currentPage ? 'active' : ''}" onclick="Market.goToPage(1)">1</button>`;

      if (this.currentPage > 3) {
        html += '<span class="pagination-ellipsis">...</span>';
      }

      // Middle pages
      for (let i = Math.max(2, this.currentPage - 1); i <= Math.min(totalPages - 1, this.currentPage + 1); i++) {
        html += `<button class="pagination-btn ${i === this.currentPage ? 'active' : ''}" onclick="Market.goToPage(${i})">${i}</button>`;
      }

      if (this.currentPage < totalPages - 2) {
        html += '<span class="pagination-ellipsis">...</span>';
      }

      // Always show last page
      html += `<button class="pagination-btn ${totalPages === this.currentPage ? 'active' : ''}" onclick="Market.goToPage(${totalPages})">${totalPages}</button>`;
    }

    // Next button
    html += `<button class="pagination-btn" ${this.currentPage === totalPages ? 'disabled' : ''} onclick="Market.goToPage(${this.currentPage + 1})">
      <i class="fa-solid fa-chevron-right"></i>
    </button>`;

    container.innerHTML = html;
  },

  // Go to page
  goToPage(page) {
    const totalPages = Math.ceil(this.totalCount / this.pageSize);
    if (page < 1 || page > totalPages) return;
    this.currentPage = page;
    this.renderCapabilities();
    // Scroll to capability section
    this.elements.capabilityGrid?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  },

  // Render Integration Section
  renderIntegration() {
    const container = this.elements.integrationGrid;
    if (!container || !this.data.integration) return;

    container.innerHTML = this.data.integration.map(item => `
      <div class="integration-card ${item.status === 'coming' ? 'coming-soon' : ''}">
        <div class="integration-card-header">
          <div class="integration-card-icon" style="background: ${item.color}">
            <i class="fa-solid ${item.icon}"></i>
          </div>
          <div>
            <div class="integration-card-title">${item.name}</div>
            <div class="integration-card-subtitle">${item.fullName}</div>
          </div>
        </div>
        <div class="integration-card-desc">${item.description}</div>
        <div class="integration-card-scenario">
          <strong>适用场景：</strong>${item.scenario}
        </div>
        <div class="integration-card-footer">
          <div class="integration-card-status ${item.status}">
            <i class="fa-solid ${item.status === 'available' ? 'fa-circle-check' : 'fa-clock'}"></i>
            ${item.status === 'available' ? '已上线' : '敬请期待'}
          </div>
          ${item.status === 'available' ? `
            <div class="integration-card-doc">
              <i class="fa-solid fa-book"></i>
              查看文档
            </div>
          ` : ''}
        </div>
      </div>
    `).join('');
  },

  // Render Recommend Section
  renderRecommend() {
    const container = this.elements.recommendGrid;
    if (!container || !this.data.recommend) return;

    const data = this.data.recommend[this.currentTab];
    if (!data) return;

    const titleMap = {
      guessYouLike: '猜你喜欢',
      latestPublish: '最新发布',
      hotCalls: '热门调用'
    };

    container.innerHTML = `
      <div style="grid-column: 1 / -1; margin-bottom: var(--space-4);">
        <h3 style="font-size: var(--font-size-md); font-weight: var(--font-weight-semibold); color: var(--color-text-primary);">
          ${titleMap[this.currentTab]}
        </h3>
      </div>
      ${data.map(item => `
        <div class="recommend-card" data-id="${item.id}">
          <div class="recommend-card-icon" style="background: ${item.color}">
            <i class="fa-solid ${item.icon}"></i>
          </div>
          <div class="recommend-card-info">
            <div class="recommend-card-name">${item.name}</div>
            <div class="recommend-card-desc">${item.description}</div>
          </div>
          <div class="recommend-card-stats">
            <div class="recommend-card-rating">
              <span class="stars">${this.renderStars(item.rating)}</span>
              ${item.rating}
            </div>
            <div class="recommend-card-calls">
              ${item.calls > 0 ? this.formatNumber(item.calls) + '次调用' : '即将上线'}
            </div>
          </div>
        </div>
      `).join('')}
    `;

    // Bind click events
    container.querySelectorAll('.recommend-card').forEach(card => {
      card.addEventListener('click', () => {
        this.openDetailDrawer(card.dataset.id);
      });
    });
  },

  // Event Handlers
  handleSearch() {
    this.searchQuery = this.elements.searchInput?.value.trim() || '';
    this.currentPage = 1;
    this.renderCapabilities();
  },

  handleFilterChange() {
    this.filterType = this.elements.filterType?.value || '';
    this.filterCategory = this.elements.filterCategory?.value || '';
    this.filterSort = this.elements.filterSort?.value || 'hot';
    this.currentPage = 1;
    this.renderCapabilities();
  },

  handleCategoryChange(categoryId) {
    this.currentCategory = categoryId;
    // Sync category dropdown
    if (this.elements.filterCategory) {
      this.elements.filterCategory.value = categoryId === 'all' ? '' : categoryId;
    }
    this.currentPage = 1;
    this.renderCategories();
    this.renderCapabilities();
  },

  switchMainTab(tabName) {
    this.currentMainTab = tabName;
    // Update tab active state
    document.querySelectorAll('.market-main-tab').forEach(tab => {
      tab.classList.toggle('active', tab.dataset.tab === tabName);
    });
    // Show/hide views
    if (this.elements.featuredView) {
      this.elements.featuredView.style.display = tabName === 'featured' ? '' : 'none';
    }
    if (this.elements.allView) {
      this.elements.allView.style.display = tabName === 'all' ? '' : 'none';
    }
  },

  handleTabChange(tabId) {
    this.currentTab = tabId;
    if (this.elements.recommendTabs) {
      this.elements.recommendTabs.querySelectorAll('.recommend-tab').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.tab === tabId);
      });
    }
    // recommend section removed - keep method for compatibility
  },

  resetFilters() {
    this.filterType = '';
    this.filterCategory = '';
    this.filterSort = 'hot';
    this.searchQuery = '';
    this.currentCategory = 'all';
    this.currentPage = 1;

    if (this.elements.filterType) this.elements.filterType.value = '';
    if (this.elements.filterCategory) this.elements.filterCategory.value = '';
    if (this.elements.filterSort) this.elements.filterSort.value = 'hot';
    if (this.elements.searchInput) this.elements.searchInput.value = '';

    this.renderCategories();
    this.renderCapabilities();
  },

  // Toggle favorite
  toggleFavorite(capabilityId) {
    const index = this.favorites.indexOf(capabilityId);
    if (index === -1) {
      this.favorites.push(capabilityId);
    } else {
      this.favorites.splice(index, 1);
    }
    this.renderCapabilities();
  },

  // My Applications Modal
  openMyApplications() {
    const body = document.getElementById('my-applications-body');
    if (!body) return;

    this.applications = (typeof ApplyStore !== 'undefined') ? ApplyStore.list() : this.applications;

    if (this.applications.length === 0) {
      body.innerHTML = `
        <div class="market-empty">
          <div class="market-empty-icon">
            <i class="fa-solid fa-inbox"></i>
          </div>
          <div class="market-empty-title">暂无申请记录</div>
          <div class="market-empty-desc">去能力市场逛逛吧</div>
        </div>
      `;
    } else {
      body.innerHTML = this.applications.map(app => {
        const cap = this.data.capabilities.find(c => c.id === (app.agentId || app.capabilityId)) || {};
        const statusMap = {
          submitted: { label: '待审核', class: 'pending' },
          approved: { label: '已通过', class: 'approved' },
          rejected: { label: '已拒绝', class: 'rejected' }
        };
        const status = statusMap[app.status] || statusMap.submitted;
        return `
        <div class="list-item">
          <div class="list-item-icon" style="background: ${cap.color || '#4F46E5'}">
            <i class="fa-solid ${cap.icon || 'fa-cube'}"></i>
          </div>
          <div class="list-item-content">
            <div class="list-item-name">${app.agentName || app.capabilityName}</div>
            <div class="list-item-desc">应用：${app.appName} | 申请时间：${app.time}</div>
          </div>
          <div class="list-item-meta">
            <span class="list-item-status ${status.class}">${status.label}</span>
            ${app.status === 'approved' ? `
              <button class="list-item-action primary" onclick="Market.openExperienceModal('${app.agentId || app.capabilityId}')">立即体验</button>
            ` : ''}
          </div>
        </div>
      `}).join('');
    }

    this.elements.myApplicationsOverlay?.classList.add('show');
    document.body.style.overflow = 'hidden';
  },

  closeMyApplications() {
    this.elements.myApplicationsOverlay?.classList.remove('show');
    document.body.style.overflow = '';
  },

  // My Favorites Modal
  openMyFavorites() {
    const body = document.getElementById('my-favorites-body');
    if (!body) return;

    if (this.favorites.length === 0) {
      body.innerHTML = `
        <div class="market-empty">
          <div class="market-empty-icon">
            <i class="fa-solid fa-heart"></i>
          </div>
          <div class="market-empty-title">暂无收藏</div>
          <div class="market-empty-desc">点击能力卡片上的小心心收藏感兴趣的能力</div>
        </div>
      `;
    } else {
      const favoriteCaps = this.data.capabilities.filter(cap => this.favorites.includes(cap.id));
      body.innerHTML = favoriteCaps.map(cap => `
        <div class="list-item">
          <div class="list-item-icon" style="background: ${cap.color}">
            <i class="fa-solid ${cap.icon}"></i>
          </div>
          <div class="list-item-content">
            <div class="list-item-name">${cap.name}</div>
            <div class="list-item-desc">${cap.description}</div>
          </div>
          <div class="list-item-meta">
            <div class="list-item-actions">
              <button class="list-item-action primary" onclick="Market.openExperienceModal('${cap.id}'); Market.closeMyFavorites();">立即体验</button>
              <button class="list-item-action danger" onclick="Market.toggleFavorite('${cap.id}'); Market.openMyFavorites();">
                <i class="fa-solid fa-trash"></i>
              </button>
            </div>
          </div>
        </div>
      `).join('');
    }

    this.elements.myFavoritesOverlay?.classList.add('show');
    document.body.style.overflow = 'hidden';
  },

  closeMyFavorites() {
    this.elements.myFavoritesOverlay?.classList.remove('show');
    document.body.style.overflow = '';
  },

  // Detail Drawer
  openDetailDrawer(capabilityId) {
    const capability = this.data.capabilities.find(c => c.id === capabilityId)
      || this.data.featured?.find(c => c.id === capabilityId);
    if (!capability) return;

    this.selectedCapability = capability;
    const detail = capability.detail;

    // Populate drawer
    const titleIcon = document.querySelector('.detail-drawer-title-icon');
    if (titleIcon) {
      titleIcon.style.background = capability.color;
      titleIcon.innerHTML = `<i class="fa-solid ${capability.icon}"></i>`;
    }

    document.querySelector('.detail-drawer-title span').textContent = capability.name;

    const drawerBody = this.elements.detailDrawer?.querySelector('.detail-drawer-body');
    if (!drawerBody) return;

    drawerBody.innerHTML = `
      <div class="detail-section">
        <div class="detail-section-title"><i class="fa-solid fa-info-circle"></i>能力简介</div>
        <div class="detail-desc">${capability.description}</div>
      </div>

      <div class="detail-section">
        <div class="detail-section-title"><i class="fa-solid fa-chart-simple"></i>基本信息</div>
        <div class="detail-meta-grid">
          <div class="detail-meta-item">
            <div class="detail-meta-label">版本</div>
            <div class="detail-meta-value">v${capability.version}</div>
          </div>
          <div class="detail-meta-item">
            <div class="detail-meta-label">类型</div>
            <div class="detail-meta-value">${capability.type}</div>
          </div>
          <div class="detail-meta-item">
            <div class="detail-meta-label">负责人</div>
            <div class="detail-meta-value">${capability.owner}</div>
          </div>
          <div class="detail-meta-item">
            <div class="detail-meta-label">最近更新</div>
            <div class="detail-meta-value">${detail?.lastUpdate || capability.updatedAt}</div>
          </div>
        </div>
      </div>

      <div class="detail-section">
        <div class="detail-section-title"><i class="fa-solid fa-tags"></i>标签</div>
        <div class="detail-tags">
          ${capability.tags.map(tag => `<span class="detail-tag">${tag}</span>`).join('')}
        </div>
      </div>

      ${detail?.inputParams?.length ? `
        <div class="detail-section">
          <div class="detail-section-title"><i class="fa-solid fa-arrow-right-to-bracket"></i>输入参数</div>
          <table class="detail-params-table">
            <thead>
              <tr>
                <th>参数名</th>
                <th>类型</th>
                <th>说明</th>
              </tr>
            </thead>
            <tbody>
              ${detail.inputParams.map(param => `
                <tr>
                  <td><span class="param-name">${param.name}</span>${param.required ? '<span class="param-required">*</span>' : ''}</td>
                  <td>${param.type}</td>
                  <td>${param.desc}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      ` : ''}

      ${detail?.outputParams?.length ? `
        <div class="detail-section">
          <div class="detail-section-title"><i class="fa-solid fa-arrow-left-from-bracket"></i>输出参数</div>
          <table class="detail-params-table">
            <thead>
              <tr>
                <th>参数名</th>
                <th>类型</th>
                <th>说明</th>
              </tr>
            </thead>
            <tbody>
              ${detail.outputParams.map(param => `
                <tr>
                  <td><span class="param-name">${param.name}</span></td>
                  <td>${param.type}</td>
                  <td>${param.desc}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      ` : ''}

      ${detail?.protocols?.length ? `
        <div class="detail-section">
          <div class="detail-section-title"><i class="fa-solid fa-plug"></i>支持协议</div>
          <div class="detail-protocols">
            ${detail.protocols.map(protocol => `
              <div class="detail-protocol">
                <i class="fa-solid fa-check"></i>
                ${protocol}
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}

      ${detail?.models?.length ? `
        <div class="detail-section">
          <div class="detail-section-title"><i class="fa-solid fa-brain"></i>关联模型</div>
          <div class="detail-tags">
            ${detail.models.map(model => `<span class="detail-tag">${model}</span>`).join('')}
          </div>
        </div>
      ` : ''}

      ${detail?.knowledgeBases?.length ? `
        <div class="detail-section">
          <div class="detail-section-title"><i class="fa-solid fa-book"></i>关联知识库</div>
          <div class="detail-tags">
            ${detail.knowledgeBases.map(kb => `<span class="detail-tag">${kb}</span>`).join('')}
          </div>
        </div>
      ` : ''}

      ${detail?.example ? `
        <div class="detail-section">
          <div class="detail-section-title"><i class="fa-solid fa-code"></i>调用示例</div>
          <div class="detail-example-label">输入 / 输出</div>
          <div class="detail-example">${detail.example}</div>
        </div>
      ` : ''}
    `;

    // Show drawer
    this.elements.detailDrawerOverlay?.classList.add('show');
    this.elements.detailDrawer?.classList.add('show');
    document.body.style.overflow = 'hidden';
  },

  closeDetailDrawer() {
    this.elements.detailDrawerOverlay?.classList.remove('show');
    this.elements.detailDrawer?.classList.remove('show');
    document.body.style.overflow = '';
    this.selectedCapability = null;
  },

  // Experience Modal
  openExperienceModal(capabilityId) {
    const capability = this.data.capabilities.find(c => c.id === capabilityId);
    if (!capability) return;

    this.selectedCapability = capability;

    // Set modal title
    const titleIcon = document.querySelector('.experience-modal-title-icon');
    if (titleIcon) {
      titleIcon.style.background = capability.color;
      titleIcon.innerHTML = `<i class="fa-solid ${capability.icon}"></i>`;
    }
    const titleSpan = document.querySelector('.experience-modal-title span');
    if (titleSpan) titleSpan.textContent = capability.name;

    // Set placeholder and examples
    const textarea = document.getElementById('experience-input');
    if (textarea && this.data.experience) {
      textarea.placeholder = this.data.experience.inputPlaceholder || '请输入您的问题...';
    }

    // Render example buttons
    const examplesContainer = document.getElementById('experience-examples');
    if (examplesContainer && this.data.experience?.examples) {
      examplesContainer.innerHTML = this.data.experience.examples.map(example => `
        <button class="experience-example-btn">${example}</button>
      `).join('');

      examplesContainer.querySelectorAll('.experience-example-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          if (textarea) textarea.value = btn.textContent;
        });
      });
    }

    // Reset result
    const resultSection = document.getElementById('experience-result');
    const loadingEl = document.getElementById('experience-loading');
    const outputEl = document.getElementById('experience-output');
    if (resultSection) resultSection.classList.remove('show');
    if (loadingEl) loadingEl.classList.add('hidden');
    if (outputEl) outputEl.classList.add('hidden');

    // Show modal
    this.elements.experienceModalOverlay?.classList.add('show');
    document.body.style.overflow = 'hidden';
  },

  closeExperienceModal() {
    this.elements.experienceModalOverlay?.classList.remove('show');
    document.body.style.overflow = '';
    this.selectedCapability = null;
  },

  runExperience() {
    const textarea = document.getElementById('experience-input');
    const input = textarea?.value.trim();
    if (!input) {
      textarea?.focus();
      return;
    }

    const loadingEl = document.getElementById('experience-loading');
    const outputEl = document.getElementById('experience-output');
    const resultEl = document.getElementById('experience-result');
    const runBtn = document.getElementById('experience-run-btn');

    // Show loading
    loadingEl?.classList.remove('hidden');
    outputEl?.classList.add('hidden');
    if (runBtn) runBtn.disabled = true;

    // Simulate API call
    setTimeout(() => {
      loadingEl?.classList.add('hidden');
      outputEl?.classList.remove('hidden');
      resultEl?.classList.add('show');
      if (runBtn) runBtn.disabled = false;

      // Mock response
      if (outputEl) {
        outputEl.textContent = `根据您的输入，系统执行了以下分析：

✅ 数据集识别：销售数据集
✅ 自动分类：业务数据 > 销售统计
✅ 生成标签：["销售", "明细", "地区", "收入"]

📊 目录结构已生成：
/销售数据集/
  ├── 2024年/
  │   ├── Q1/
  │   ├── Q2/
  │   ├── Q3/
  │   └── Q4/
  └── 汇总/

建议：检测到 ${Math.floor(Math.random() * 100 + 50)} 条重复记录，是否需要清理？`;
      }

      // Update stats
      const tokensEl = document.getElementById('result-tokens');
      const latencyEl = document.getElementById('result-latency');
      if (tokensEl) tokensEl.textContent = Math.floor(Math.random() * 500 + 200);
      if (latencyEl) latencyEl.textContent = (Math.random() * 0.5 + 0.1).toFixed(2) + 's';

    }, 1500);
  },

  // Apply Modal
  openApplyModal() {
    this.closeDetailDrawer();
    this.elements.applyModalOverlay?.classList.add('show');
    document.body.style.overflow = 'hidden';

    // Pre-fill capability name
    if (this.selectedCapability) {
      const nameInput = document.getElementById('apply-capability-name');
      if (nameInput) nameInput.value = this.selectedCapability.name;
    }
  },

  // Open apply modal from card hover button
  openApplyModalFromCard(capabilityId) {
    const capability = this.data.capabilities.find(c => c.id === capabilityId)
      || this.data.featured?.find(c => c.id === capabilityId);
    if (!capability) return;
    // 注意: openApplyModal -> closeDetailDrawer 会清空 selectedCapability, 先开弹窗再赋值
    this.openApplyModal();
    this.selectedCapability = capability;
    const nameInput = document.getElementById('apply-capability-name');
    if (nameInput) nameInput.value = capability.name;
  },

  // Open experience page (navigate iframe to experience.html)
  openExperiencePage(capabilityId) {
    const cap = this.data.capabilities.find(c => c.id === capabilityId)
      || this.data.featured?.find(c => c.id === capabilityId);
    const capName = cap ? `在线体验：${cap.name}` : '在线体验';
    const targetUrl = `pages/ai-open/experience.html?id=${capabilityId}`;
    const breadcrumb = `
      <span>能力市场</span>
      <i class="fa-solid fa-chevron-right breadcrumb-sep"></i>
      <span>${capName}</span>
    `;
    if (window.parent !== window) {
      window.parent.postMessage({ type: 'navigate', url: targetUrl, breadcrumb }, '*');
    } else {
      window.location.href = targetUrl;
    }
  },

  closeApplyModal() {
    this.elements.applyModalOverlay?.classList.remove('show');
    document.body.style.overflow = '';
  },

  submitApply() {
    const appName = document.getElementById('apply-app-name')?.value.trim();
    const useCase = document.getElementById('apply-use-case')?.value.trim();
    const protocol = document.getElementById('apply-protocol')?.value || 'MCP';

    if (!appName || !useCase) {
      this.showToast('请填写完整信息', 'warning');
      return;
    }
    if (!this.selectedCapability) {
      this.showToast('请先选择能力', 'warning');
      return;
    }
    if (typeof ApplyStore === 'undefined') {
      this.showToast('申请服务暂不可用', 'error');
      return;
    }

    ApplyStore.submit({
      agentId: this.selectedCapability.agentId || this.selectedCapability.id,
      agentName: this.selectedCapability.name,
      appName,
      useCase,
      protocol
    });
    this.applications = ApplyStore.list();

    this.showToast('申请已提交,请等待管理员在「系统管理-应用管理」中审核', 'success');
    this.closeApplyModal();

    // Reset form
    document.getElementById('apply-form')?.reset();
  },

  // Toast notification (simple)
  showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `market-toast market-toast-${type}`;
    toast.innerHTML = `<i class="fa-solid fa-${type === 'success' ? 'check-circle' : type === 'warning' ? 'exclamation-circle' : 'info-circle'}"></i> ${message}`;
    toast.style.cssText = `
      position: fixed;
      top: 24px;
      right: 24px;
      padding: 12px 20px;
      background: ${type === 'success' ? '#10B981' : type === 'warning' ? '#F59E0B' : '#4F46E5'};
      color: white;
      border-radius: 8px;
      font-size: 14px;
      z-index: 9999;
      animation: toastIn 0.3s ease;
    `;

    // Add animation
    const style = document.createElement('style');
    style.textContent = `
      @keyframes toastIn {
        from { opacity: 0; transform: translateY(-10px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes toastOut {
        from { opacity: 1; transform: translateY(0); }
        to { opacity: 0; transform: translateY(-10px); }
      }
    `;
    document.head.appendChild(style);

    document.body.appendChild(toast);

    setTimeout(() => {
      toast.style.animation = 'toastOut 0.3s ease forwards';
      setTimeout(() => {
        toast.remove();
        style.remove();
      }, 300);
    }, 3000);
  },

  // Close all modals
  closeAllModals() {
    this.closeDetailDrawer();
    this.closeExperienceModal();
    this.closeApplyModal();
    this.closeMyApplications();
    this.closeMyFavorites();
  },

  // Utility functions
  formatNumber(num) {
    if (num >= 10000) {
      return (num / 10000).toFixed(1) + 'w';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  },

  renderStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 >= 0.5;
    let stars = '★'.repeat(fullStars);
    if (hasHalf) stars += '½';
    stars += '☆'.repeat(5 - fullStars - (hasHalf ? 1 : 0));
    return stars;
  }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  Market.init();
});
