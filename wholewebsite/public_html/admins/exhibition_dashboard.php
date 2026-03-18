<?php
include_once 'auth.php';
include_once 'header.php';
?>
<style>
  .live-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    display: inline-block;
    margin-right: 6px;
    background: #9ca3af;
  }
  .live-dot.online {
    background: #10b981;
    box-shadow: 0 0 0 0 rgba(16,185,129,.7);
    animation: pulse 1.6s infinite;
  }
  @keyframes pulse {
    0% { box-shadow: 0 0 0 0 rgba(16,185,129,.6); }
    70% { box-shadow: 0 0 0 10px rgba(16,185,129,0); }
    100% { box-shadow: 0 0 0 0 rgba(16,185,129,0); }
  }
  .metric-card .card-title {
    font-size: 1.6rem;
    font-weight: 700;
  }
  .feed-list {
    max-height: 260px;
    overflow-y: auto;
  }
  .feed-item {
    border-bottom: 1px solid #edf2f7;
    padding: 10px 0;
  }
  .nowrap {
    white-space: nowrap;
  }
  .truncate-col {
    max-width: 220px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>

<div class="container">
  <div class="page-inner">
    <div class="d-flex align-items-center justify-content-between flex-wrap gap-2 pt-2 pb-3">
      <div>
        <h3 class="fw-bold mb-1">Exhibition Control Center</h3>
        <p class="text-muted mb-0">Live bookings, payment pipeline, and investor-ready reporting</p>
      </div>
      <div class="d-flex align-items-center gap-3">
        <span id="liveStatus" class="text-muted"><span class="live-dot" id="liveDot"></span>Connecting live stream...</span>
        <small class="text-muted" id="lastUpdated">Last update: -</small>
      </div>
    </div>

    <div class="card mb-4">
      <div class="card-body">
        <div class="row g-3 align-items-end">
          <div class="col-md-2">
            <label class="form-label">Status</label>
            <select id="filterStatus" class="form-select">
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="failed">Failed</option>
            </select>
          </div>
          <div class="col-md-2">
            <label class="form-label">Category</label>
            <select id="filterClientType" class="form-select">
              <option value="all">All</option>
              <option value="corporate">Corporate</option>
              <option value="startup">Startup</option>
              <option value="psu">PSU</option>
              <option value="government">Government</option>
              <option value="academia">Academia</option>
              <option value="country">Country</option>
            </select>
          </div>
          <div class="col-md-2">
            <label class="form-label">From Date</label>
            <input type="date" id="filterFromDate" class="form-control" />
          </div>
          <div class="col-md-2">
            <label class="form-label">To Date</label>
            <input type="date" id="filterToDate" class="form-control" />
          </div>
          <div class="col-md-2">
            <label class="form-label">Search</label>
            <input type="text" id="filterSearch" class="form-control" placeholder="Name, phone, email, txnid" />
          </div>
          <div class="col-md-2 d-grid gap-2">
            <button id="applyFilters" class="btn btn-primary">Apply</button>
            <button id="resetFilters" class="btn btn-light">Reset</button>
          </div>
        </div>
        <div class="d-flex gap-2 mt-3 flex-wrap">
          <a id="downloadExcel" class="btn btn-success btn-sm" href="#">Download Excel (CSV)</a>
          <button id="manualRefresh" class="btn btn-secondary btn-sm">Refresh Now</button>
          <button id="toggleAutoRefresh" class="btn btn-dark btn-sm">Auto Refresh: ON</button>
        </div>
      </div>
    </div>

    <div class="row mb-4" id="metricsRow">
      <div class="col-sm-6 col-md-3">
        <div class="card metric-card"><div class="card-body"><p class="text-muted mb-1">Total Forms</p><h4 class="card-title" id="mTotal">0</h4></div></div>
      </div>
      <div class="col-sm-6 col-md-3">
        <div class="card metric-card"><div class="card-body"><p class="text-muted mb-1">Paid Bookings</p><h4 class="card-title text-success" id="mPaid">0</h4></div></div>
      </div>
      <div class="col-sm-6 col-md-3">
        <div class="card metric-card"><div class="card-body"><p class="text-muted mb-1">Pending Follow-up</p><h4 class="card-title text-warning" id="mPending">0</h4></div></div>
      </div>
      <div class="col-sm-6 col-md-3">
        <div class="card metric-card"><div class="card-body"><p class="text-muted mb-1">Today Captured</p><h4 class="card-title text-info" id="mToday">0</h4></div></div>
      </div>
      <div class="col-sm-6 col-md-3">
        <div class="card metric-card"><div class="card-body"><p class="text-muted mb-1">Token Collected</p><h4 class="card-title" id="mTokenCollected">₹0</h4></div></div>
      </div>
      <div class="col-sm-6 col-md-3">
        <div class="card metric-card"><div class="card-body"><p class="text-muted mb-1">Projected Value</p><h4 class="card-title" id="mProjected">₹0</h4></div></div>
      </div>
      <div class="col-sm-6 col-md-3">
        <div class="card metric-card"><div class="card-body"><p class="text-muted mb-1">Outstanding (Paid)</p><h4 class="card-title" id="mOutstanding">₹0</h4></div></div>
      </div>
      <div class="col-sm-6 col-md-3">
        <div class="card metric-card"><div class="card-body"><p class="text-muted mb-1">This Month Forms</p><h4 class="card-title" id="mMonth">0</h4></div></div>
      </div>
      <div class="col-sm-6 col-md-3">
        <div class="card metric-card"><div class="card-body"><p class="text-muted mb-1">Verified Paid</p><h4 class="card-title text-success" id="mVerifiedPaid">0</h4></div></div>
      </div>
      <div class="col-sm-6 col-md-3">
        <div class="card metric-card"><div class="card-body"><p class="text-muted mb-1">Emails Sent</p><h4 class="card-title text-primary" id="mMailSent">0</h4></div></div>
      </div>
      <div class="col-sm-6 col-md-3">
        <div class="card metric-card"><div class="card-body"><p class="text-muted mb-1">Total Callbacks</p><h4 class="card-title" id="mCallbacks">0</h4></div></div>
      </div>
    </div>

    <div class="row mb-4">
      <div class="col-md-8">
        <div class="card">
          <div class="card-header"><h4 class="card-title mb-0">Category Breakdown</h4></div>
          <div class="card-body">
            <div class="row" id="categoryBreakdown"></div>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card">
          <div class="card-header"><h4 class="card-title mb-0">Live Activity Feed</h4></div>
          <div class="card-body feed-list" id="liveFeed"></div>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-header d-flex justify-content-between align-items-center">
        <h4 class="card-title mb-0">Exhibitor Form Submissions</h4>
        <small class="text-muted">All details from booking forms are captured here</small>
      </div>
      <div class="card-body">
        <div class="table-responsive">
          <table id="exhibitionTable" class="display table table-striped table-hover">
            <thead>
              <tr>
                <th>ID</th>
                <th>Time</th>
                <th>Status</th>
                <th>Verified</th>
                <th>Mail Status</th>
                <th>Category</th>
                <th>SQM</th>
                <th>Name</th>
                <th>Company</th>
                <th>Designation</th>
                <th>Industry</th>
                <th>Email</th>
                <th>Phone</th>
                <th>City/Country</th>
                <th>Website</th>
                <th>Description</th>
                <th>Booking</th>
                <th>Total</th>
                <th>Balance</th>
                <th>Passes</th>
                <th>Txn ID</th>
              </tr>
            </thead>
            <tbody></tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</div>

<script>
  const state = {
    table: null,
    autoRefresh: true,
    refreshTimer: null,
    eventSource: null,
    lastLiveId: 0,
    liveFeedItems: []
  };

  function esc(str) {
    return String(str || '').replace(/[&<>'"]/g, (c) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[c]));
  }

  function formatMoney(value, currency = '₹') {
    const num = Number(value || 0);
    return currency + num.toLocaleString('en-IN', { maximumFractionDigits: 2 });
  }

  function toLabel(v) {
    const s = String(v || '').replace(/_/g, ' ');
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  function statusBadge(status) {
    const s = String(status || '').toLowerCase();
    if (s === 'paid') return '<span class="badge badge-success">PAID</span>';
    if (s === 'failed') return '<span class="badge badge-danger">FAILED</span>';
    return '<span class="badge badge-warning">PENDING</span>';
  }

  function yesNoBadge(flag, okLabel, noLabel) {
    const v = Number(flag || 0);
    if (v === 1) {
      return '<span class="badge badge-success">' + esc(okLabel) + '</span>';
    }
    if (v === 2) {
      return '<span class="badge badge-info">SENDING</span>';
    }
    return '<span class="badge badge-secondary">' + esc(noLabel) + '</span>';
  }

  function getFilters() {
    return {
      status: document.getElementById('filterStatus').value,
      client_type: document.getElementById('filterClientType').value,
      from_date: document.getElementById('filterFromDate').value,
      to_date: document.getElementById('filterToDate').value,
      search: document.getElementById('filterSearch').value.trim()
    };
  }

  function toQuery(params) {
    const usp = new URLSearchParams();
    Object.keys(params).forEach((k) => {
      if (params[k] !== '' && params[k] !== null && params[k] !== undefined) {
        usp.set(k, params[k]);
      }
    });
    return usp.toString();
  }

  function updateDownloadLink() {
    const q = toQuery(getFilters());
    document.getElementById('downloadExcel').href = 'exhibition_export.php' + (q ? ('?' + q) : '');
  }

  function renderMetrics(stats) {
    document.getElementById('mTotal').textContent = stats.total || 0;
    document.getElementById('mPaid').textContent = stats.paid || 0;
    document.getElementById('mPending').textContent = stats.pending || 0;
    document.getElementById('mToday').textContent = stats.today || 0;
    document.getElementById('mMonth').textContent = stats.this_month || 0;
    document.getElementById('mVerifiedPaid').textContent = stats.verified_paid || 0;
    document.getElementById('mMailSent').textContent = stats.mail_sent_count || 0;
    document.getElementById('mCallbacks').textContent = stats.callbacks_total || 0;
    document.getElementById('mTokenCollected').textContent = formatMoney(stats.token_collected || 0);
    document.getElementById('mProjected').textContent = formatMoney(stats.projected_value || 0);
    document.getElementById('mOutstanding').textContent = formatMoney(stats.outstanding_on_paid || 0);
  }

  function renderCategoryBreakdown(byType) {
    const container = document.getElementById('categoryBreakdown');
    const entries = Object.entries(byType || {});
    if (!entries.length) {
      container.innerHTML = '<div class="col-12"><p class="text-muted mb-0">No data available for selected filters.</p></div>';
      return;
    }

    container.innerHTML = entries.map(([type, data]) => `
      <div class="col-sm-6 col-lg-4 mb-3">
        <div class="border rounded p-3 h-100">
          <div class="d-flex justify-content-between align-items-center mb-1">
            <strong>${esc(toLabel(type))}</strong>
            <span class="badge badge-primary">${Number(data.count || 0)}</span>
          </div>
          <div class="text-muted small">Paid: ${Number(data.paid_count || 0)}</div>
          <div class="small mt-1">Projected: <strong>${formatMoney(data.projected_value || 0)}</strong></div>
        </div>
      </div>
    `).join('');
  }

  function renderTable(rows) {
    const tbody = document.querySelector('#exhibitionTable tbody');
    tbody.innerHTML = (rows || []).map((row) => `
      <tr>
        <td class="nowrap">${row.id}</td>
        <td class="nowrap">${esc(row.created_at_human)}</td>
        <td class="nowrap">${statusBadge(row.status)}</td>
        <td class="nowrap">${yesNoBadge(row.payment_verified, 'YES', 'NO')}</td>
        <td class="nowrap">${yesNoBadge(row.mail_sent, 'SENT', 'PENDING')}</td>
        <td class="nowrap">${esc(toLabel(row.client_type))}</td>
        <td class="nowrap">${esc(row.selected_size)} sqm</td>
        <td>${esc(row.name)}</td>
        <td class="truncate-col" title="${esc(row.company)}">${esc(row.company)}</td>
        <td>${esc(row.designation)}</td>
        <td>${esc(row.industry)}</td>
        <td class="truncate-col" title="${esc(row.email)}">${esc(row.email)}</td>
        <td>${esc(row.phone)}</td>
        <td>${esc(row.city_country)}</td>
        <td class="truncate-col" title="${esc(row.website)}">${esc(row.website)}</td>
        <td class="truncate-col" title="${esc(row.description)}">${esc(row.description)}</td>
        <td class="nowrap">${formatMoney(row.payable_amount, row.currency)}</td>
        <td class="nowrap">${formatMoney(row.package_total, row.currency)}</td>
        <td class="nowrap">${formatMoney(row.balance_due, row.currency)}</td>
        <td class="truncate-col" title="${esc(row.pass_allocation)}">${esc(row.pass_allocation)}</td>
        <td class="truncate-col" title="${esc(row.txnid)}">${esc(row.txnid)}</td>
      </tr>
    `).join('');

    if (state.table) {
      state.table.destroy();
      state.table = null;
    }

    state.table = new DataTable('#exhibitionTable', {
      pageLength: 25,
      order: [[0, 'desc']],
      layout: {
        topStart: {
          buttons: ['copyHtml5', 'excelHtml5', 'csvHtml5', 'pdfHtml5']
        }
      }
    });
  }

  function setLiveStatus(online, text) {
    const status = document.getElementById('liveStatus');
    status.innerHTML = '<span class="live-dot ' + (online ? 'online' : '') + '"></span>' + esc(text);
  }

  function appendFeed(events) {
    if (!Array.isArray(events) || !events.length) {
      return;
    }

    events.forEach((evt) => {
      if (!evt || !evt.id) return;
      if (state.liveFeedItems.find((x) => x.id === evt.id)) return;
      state.liveFeedItems.unshift(evt);
    });

    state.liveFeedItems = state.liveFeedItems.slice(0, 20);

    const feed = document.getElementById('liveFeed');
    feed.innerHTML = state.liveFeedItems.map((item) => `
      <div class="feed-item">
        <div class="d-flex justify-content-between">
          <strong>${esc(item.name || 'Unknown')}</strong>
          ${statusBadge(item.status || 'pending')}
        </div>
        <div class="small text-muted">${esc(toLabel(item.client_type))} | ${esc(item.company || '-')}</div>
        <div class="small">Projected: <strong>${formatMoney(item.package_total || 0)}</strong></div>
        <div class="small text-muted">${esc(item.created_at_human || '')}</div>
      </div>
    `).join('');
  }

  async function loadData(useFilters = true) {
    try {
      const query = useFilters ? ('?' + toQuery(getFilters())) : '';
      const response = await fetch('exhibition_data.php' + query, { cache: 'no-store' });
      const data = await response.json();
      if (!data.success) {
        return;
      }

      renderMetrics(data.stats || {});
      renderCategoryBreakdown((data.stats || {}).by_client_type || {});
      renderTable(data.rows || []);
      appendFeed((data.rows || []).slice(0, 5).map((r) => ({
        id: r.id,
        name: r.name,
        company: r.company,
        client_type: r.client_type,
        status: r.status,
        package_total: r.package_total,
        created_at_human: r.created_at_human
      })));
      updateDownloadLink();

      document.getElementById('lastUpdated').textContent = 'Last update: ' + new Date().toLocaleString('en-IN');
    } catch (err) {
      console.error('Dashboard fetch error:', err);
    }
  }

  function connectLiveStream() {
    if (state.eventSource) {
      state.eventSource.close();
    }

    const es = new EventSource('exhibition_live_events.php?last_id=' + state.lastLiveId);
    state.eventSource = es;

    es.addEventListener('dashboard', (event) => {
      try {
        const payload = JSON.parse(event.data || '{}');
        state.lastLiveId = Number(payload.last_id || state.lastLiveId || 0);
        setLiveStatus(true, 'Live connected');

        if (payload.stats) {
          renderMetrics(payload.stats);
          renderCategoryBreakdown((payload.stats || {}).by_client_type || {});
        }

        if (Array.isArray(payload.latest) && payload.latest.length) {
          appendFeed(payload.latest);
        }

        if (state.autoRefresh) {
          loadData(true);
        }
      } catch (e) {
        console.error('Live parse error', e);
      }
    });

    es.onerror = () => {
      setLiveStatus(false, 'Reconnecting live stream...');
    };
  }

  function setupAutoRefresh() {
    if (state.refreshTimer) {
      clearInterval(state.refreshTimer);
    }
    state.refreshTimer = setInterval(() => {
      if (state.autoRefresh) {
        loadData(true);
      }
    }, 30000);
  }

  document.getElementById('applyFilters').addEventListener('click', () => {
    loadData(true);
  });

  document.getElementById('manualRefresh').addEventListener('click', () => {
    loadData(true);
  });

  document.getElementById('resetFilters').addEventListener('click', () => {
    document.getElementById('filterStatus').value = 'all';
    document.getElementById('filterClientType').value = 'all';
    document.getElementById('filterFromDate').value = '';
    document.getElementById('filterToDate').value = '';
    document.getElementById('filterSearch').value = '';
    loadData(true);
  });

  document.getElementById('toggleAutoRefresh').addEventListener('click', (e) => {
    state.autoRefresh = !state.autoRefresh;
    e.target.textContent = 'Auto Refresh: ' + (state.autoRefresh ? 'ON' : 'OFF');
    e.target.className = state.autoRefresh ? 'btn btn-dark btn-sm' : 'btn btn-outline-dark btn-sm';
  });

  loadData(true);
  connectLiveStream();
  setupAutoRefresh();
</script>

<?php include_once 'footer.php'; ?>
