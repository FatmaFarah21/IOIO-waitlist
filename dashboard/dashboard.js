const BASE_URL = 'http://localhost:5001/api';

// Helper to fetch JSON
async function fetchData(endpoint) {
  try {
    const res = await fetch(`${BASE_URL}/${endpoint}`);
    if (!res.ok) throw new Error(`Failed to fetch ${endpoint}`);
    const result = await res.json();
    return result.data || [];
  } catch (err) {
    console.error(`Error fetching ${endpoint}:`, err);
    return [];
  }
}

// Format date for display
function formatDate(dateString) {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// Render table
function renderTable(tableId, data, columns, type) {
  const tbody = document.getElementById(tableId).querySelector('tbody');
  
  if (!data || data.length === 0) {
    tbody.innerHTML = '<tr><td colspan="' + columns.length + '" class="no-data">No data available</td></tr>';
    return;
  }
  
  tbody.innerHTML = '';
  
  data.forEach(item => {
    const tr = document.createElement('tr');
    
    // Add data cells
    columns.forEach(col => {
      const td = document.createElement('td');
      
      if (col.key === 'created_at') {
        td.textContent = formatDate(item[col.key]);
      } else if (col.key === 'actions') {
        // Add action buttons
        const viewBtn = document.createElement('button');
        viewBtn.textContent = 'View';
        viewBtn.className = 'view-btn';
        viewBtn.onclick = () => showModal(item, type);
        
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.className = 'delete-btn';
        deleteBtn.onclick = async () => {
          if (confirm(`Are you sure you want to delete this ${type}?`)) {
            await deleteItem(type, item.id);
            loadDashboard();
          }
        };
        
        td.appendChild(viewBtn);
        td.appendChild(deleteBtn);
      } else {
        td.textContent = item[col.key] ?? 'N/A';
      }
      
      tr.appendChild(td);
    });
    
    tbody.appendChild(tr);
  });
}

// Show detail modal
function showModal(item, type) {
  const modal = document.getElementById('detailModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalBody = document.getElementById('modalBody');
  
  modalTitle.textContent = `${type.charAt(0).toUpperCase() + type.slice(1)} Details`;
  
  let html = '';
  for (const key in item) {
    if (item.hasOwnProperty(key) && key !== 'id') {
      html += `
        <div class="detail-item">
          <div class="detail-label">${key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</div>
          <div>${key.includes('date') || key.includes('created') ? formatDate(item[key]) : (item[key] || 'N/A')}</div>
        </div>
      `;
    }
  }
  
  modalBody.innerHTML = html;
  modal.style.display = 'flex';
}

// Close modal
document.getElementById('closeModal').onclick = function() {
  document.getElementById('detailModal').style.display = 'none';
};

// Close modal when clicking outside
window.onclick = function(event) {
  const modal = document.getElementById('detailModal');
  if (event.target === modal) {
    modal.style.display = 'none';
  }
};

// Delete function
async function deleteItem(type, id) {
  try {
    // Note: Supabase doesn't have a DELETE endpoint in our current backend
    // We would need to implement this in the backend
    alert(`Delete functionality would remove item ${id} of type ${type}. Implementation needed in backend.`);
    console.log(`Delete request for ${type} with id ${id}`);
  } catch (err) {
    console.error('Delete failed', err);
    alert('Delete failed: ' + err.message);
  }
}

// Update stats
function updateStats(properties, services) {
  document.getElementById('totalProperties').textContent = properties.length;
  document.getElementById('totalServices').textContent = services.length;
  
  // Calculate recent activity (last 24 hours)
  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const recentProperties = properties.filter(p => new Date(p.created_at) > twentyFourHoursAgo);
  const recentServices = services.filter(s => new Date(s.created_at) > twentyFourHoursAgo);
  document.getElementById('recentActivity').textContent = recentProperties.length + recentServices.length;
}

// Filter data based on search term
function filterData(data, searchTerm) {
  if (!searchTerm) return data;
  
  return data.filter(item => {
    return Object.values(item).some(value => 
      value && value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
  });
}

// Load dashboard
async function loadDashboard() {
  try {
    // Show loading state
    document.getElementById('propertiesTable').querySelector('tbody').innerHTML = '<tr><td colspan="6" class="no-data">Loading properties...</td></tr>';
    document.getElementById('servicesTable').querySelector('tbody').innerHTML = '<tr><td colspan="6" class="no-data">Loading services...</td></tr>';
    
    // Fetch data
    const properties = await fetchData('properties');
    const services = await fetchData('service');
    
    // Update stats
    updateStats(properties, services);
    
    // Define columns
    const propertyColumns = [
      { key: 'id' },
      { key: 'name' },
      { key: 'email' },
      { key: 'property_type' },
      { key: 'created_at' },
      { key: 'actions' }
    ];
    
    const serviceColumns = [
      { key: 'id' },
      { key: 'name' },
      { key: 'email' },
      { key: 'service_type' },
      { key: 'created_at' },
      { key: 'actions' }
    ];
    
    // Render tables
    renderTable('propertiesTable', properties, propertyColumns, 'property');
    renderTable('servicesTable', services, serviceColumns, 'service');
    
  } catch (error) {
    console.error('Error loading dashboard:', error);
    document.getElementById('propertiesTable').querySelector('tbody').innerHTML = '<tr><td colspan="6" class="no-data">Error loading data</td></tr>';
    document.getElementById('servicesTable').querySelector('tbody').innerHTML = '<tr><td colspan="6" class="no-data">Error loading data</td></tr>';
  }
}

// Search functionality
document.getElementById('searchBox').addEventListener('input', function(e) {
  // In a full implementation, this would re-filter the displayed data
  // For now, we'll just log the search term
  console.log('Search term:', e.target.value);
});

// Refresh button
document.getElementById('refreshBtn').addEventListener('click', loadDashboard);

// Initialize
document.addEventListener('DOMContentLoaded', loadDashboard);