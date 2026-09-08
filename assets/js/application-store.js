/* =====================================================
   Application & Apply Store
   应用(ai_platform_apps) + 能力(Agent)授权申请(acp_apply_store)
   Agent 即能力: 授权对象为 agentId
   ===================================================== */
(function () {
  'use strict';

  const APP_KEY = 'ai_platform_apps';
  const APPLY_KEY = 'acp_apply_store';

  function emit(store, action, id) {
    window.dispatchEvent(new CustomEvent('acp-store-change', { detail: { store, action, id } }));
  }

  function rand(len) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let out = '';
    for (let i = 0; i < len; i++) out += chars.charAt(Math.floor(Math.random() * chars.length));
    return out;
  }

  function genId(prefix) {
    return prefix + '-' + String(Date.now()).slice(-6);
  }

  const ApplicationStore = {
    list() {
      try {
        const raw = localStorage.getItem(APP_KEY);
        if (raw) {
          const list = JSON.parse(raw);
          let changed = false;
          (list || []).forEach(a => {
            const caps = a.authorizedAgents || a.authorizedCapabilities;
            if (Array.isArray(caps) && caps.some(x => !x.agentId && !x.capabilityId)) {
              a.authorizedAgents = caps.map(x => ({ agentId: x.agentId || x.capabilityId || x.id, status: 'approved', grantedAt: x.grantedAt || a.createTime || '' }));
              delete a.authorizedCapabilities;
              changed = true;
            } else if (a.authorizedCapabilities && !a.authorizedAgents) {
              a.authorizedAgents = a.authorizedCapabilities.map(x => ({ agentId: x.capabilityId || x.id, status: 'approved', grantedAt: x.grantedAt || a.createTime || '' }));
              delete a.authorizedCapabilities;
              changed = true;
            }
          });
          if (changed) this.save(list);
          return list;
        }
      } catch (e) { /* ignore */ }
      const now = new Date().toISOString().slice(0, 16).replace('T', ' ');
      const seed = [{
        id: 'app-001', name: '数据资源管理系统', code: 'data-resource-system', type: '业务应用',
        description: '', status: 'active',
        clientId: 'drs_' + rand(16), clientSecret: 'drs_' + rand(32),
        authorizedAgents: [{ agentId: 'agt-001', status: 'approved', grantedAt: now }],
        createTime: now, lastCall: '-'
      }];
      this.save(seed);
      return seed;
    },
    save(list) { try { localStorage.setItem(APP_KEY, JSON.stringify(list)); } catch (e) { /* ignore */ } },
    get(id) { return this.list().find(a => a.id === id) || null; },
    upsert(app) {
      const list = this.list();
      const i = list.findIndex(a => a.id === app.id);
      if (i >= 0) list[i] = app; else list.unshift(app);
      this.save(list);
      emit('application', 'upsert', app.id);
      return app;
    },
    createFromApply(req) {
      const now = new Date().toISOString().slice(0, 16).replace('T', ' ');
      const app = {
        id: genId('app'),
        name: req.appName,
        code: 'app-' + String(Date.now()).slice(-6),
        type: '业务应用',
        description: '由「' + req.agentName + '」使用申请自动创建',
        status: 'active',
        clientId: rand(16),
        clientSecret: rand(32),
        authorizedAgents: [{ agentId: req.agentId, status: 'approved', grantedAt: now }],
        createTime: now,
        lastCall: '-'
      };
      this.upsert(app);
      return app;
    },
    grant(appId, agentId) {
      const app = this.get(appId);
      if (!app) return null;
      app.authorizedAgents = app.authorizedAgents || [];
      if (!app.authorizedAgents.some(a => a.agentId === agentId)) {
        app.authorizedAgents.push({ agentId, status: 'approved', grantedAt: new Date().toISOString().slice(0, 16).replace('T', ' ') });
      }
      this.upsert(app);
      return app;
    },
    revoke(appId, agentId) {
      const app = this.get(appId);
      if (!app) return null;
      app.authorizedAgents = (app.authorizedAgents || []).filter(a => a.agentId !== agentId);
      this.upsert(app);
      return app;
    }
  };

  const ApplyStore = {
    list() {
      try {
        const raw = localStorage.getItem(APPLY_KEY);
        if (raw) return JSON.parse(raw);
      } catch (e) { /* ignore */ }
      return [];
    },
    save(list) { try { localStorage.setItem(APPLY_KEY, JSON.stringify(list)); } catch (e) { /* ignore */ } },
    submit(req) {
      const list = this.list();
      const item = {
        id: genId('appl'),
        agentId: req.agentId,
        agentName: req.agentName,
        appName: req.appName,
        useCase: req.useCase,
        protocol: req.protocol || 'MCP',
        status: 'submitted',
        time: new Date().toISOString().slice(0, 16).replace('T', ' '),
        applicant: '林砚舟'
      };
      list.unshift(item);
      this.save(list);
      emit('apply', 'submit', item.id);
      return item;
    },
    approve(id) {
      const list = this.list();
      const item = list.find(a => a.id === id);
      if (!item || item.status !== 'submitted') return null;
      const existed = ApplicationStore.list().find(a => a.name === item.appName);
      if (existed) ApplicationStore.grant(existed.id, item.agentId);
      else ApplicationStore.createFromApply(item);
      item.status = 'approved';
      this.save(list);
      emit('apply', 'approve', id);
      return item;
    },
    reject(id, reason) {
      const list = this.list();
      const item = list.find(a => a.id === id);
      if (!item || item.status !== 'submitted') return null;
      item.status = 'rejected';
      item.reason = reason || '';
      this.save(list);
      emit('apply', 'reject', id);
      return item;
    }
  };

  window.ApplicationStore = ApplicationStore;
  window.ApplyStore = ApplyStore;
})();
