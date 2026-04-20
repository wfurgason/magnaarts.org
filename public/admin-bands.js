// Admin bands page — assign modal + approve/reject/unassign
var currentBandId = '';
var currentAvailDates = [];

function bandsInit() {
  var assignModal      = document.getElementById('assign-modal');
  var assignWarning    = document.getElementById('assign-match-warning');
  var assignError      = document.getElementById('assign-error');
  var assignSubmit     = document.getElementById('assign-submit');
  var assignBandNameEl = document.getElementById('assign-band-name');

  var currentAutoApprove = false;

  function openAssign(bandId, bandName, availDates, autoApprove) {
    currentBandId = bandId;
    currentAvailDates = availDates;
    currentAutoApprove = !!autoApprove;
    if (assignBandNameEl) assignBandNameEl.textContent = bandName;
    if (assignWarning)    assignWarning.hidden  = true;
    if (assignError)      assignError.hidden    = true;
    if (assignSubmit) {
      assignSubmit.disabled = true;
      assignSubmit.textContent = currentAutoApprove ? 'Approve & Assign Date →' : 'Assign Date →';
    }
    if (assignModal) {
      assignModal.querySelectorAll('input[type="radio"]').forEach(function(r) { r.checked = false; });
      assignModal.style.display = 'flex';
    }
  }

  function closeAssign() {
    if (assignModal) assignModal.style.display = 'none';
  }

  // Approve / Reject
  document.querySelectorAll('[data-action="approve"], [data-action="reject"]').forEach(function(btn) {
    btn.addEventListener('click', async function() {
      var status = btn.dataset.action === 'approve' ? 'approved' : 'rejected';
      btn.disabled = true;
      var res = await fetch('/api/admin/update-submission', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: btn.dataset.id, collection: btn.dataset.collection, status: status }),
      });
      if (res.ok) window.location.reload();
      else { alert('Action failed.'); btn.disabled = false; }
    });
  });

  // Open assign modal
  document.querySelectorAll('.assign-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      var availDates = [];
      try { availDates = JSON.parse(btn.dataset.available || '[]'); } catch(e) {}
      openAssign(btn.dataset.bandId, btn.dataset.bandName, availDates, btn.dataset.autoApprove === 'true');
    });
  });

  // Close buttons
  var closeBtn = document.getElementById('assign-close');
  if (closeBtn) closeBtn.addEventListener('click', closeAssign);

  var cancelBtn = document.getElementById('assign-cancel');
  if (cancelBtn) cancelBtn.addEventListener('click', closeAssign);

  if (assignModal) {
    assignModal.addEventListener('click', function(e) {
      if (e.target === assignModal) closeAssign();
    });

    // Radio selection
    assignModal.querySelectorAll('input[type="radio"]').forEach(function(radio) {
      radio.addEventListener('change', function() {
        var opt = radio.closest('.shell-option');
        var selectedDate = opt ? opt.getAttribute('data-date') : '';
        if (assignSubmit) assignSubmit.disabled = false;
        if (assignWarning) assignWarning.hidden = currentAvailDates.length === 0 || currentAvailDates.includes(selectedDate);
      });
    });
  }

  // Submit
  if (assignSubmit) {
    assignSubmit.addEventListener('click', async function() {
      var selected = assignModal ? assignModal.querySelector('input[name="shell"]:checked') : null;
      if (!currentBandId || !selected) {
        if (assignError) {
          assignError.textContent = !currentBandId ? 'Error: band ID missing. Please close and try again.' : 'Please select a date.';
          assignError.hidden = false;
        }
        return;
      }
      if (assignError) assignError.hidden = true;
      assignSubmit.disabled = true;
      assignSubmit.textContent = 'Assigning...';

      // If band is still pending, approve it first
      if (currentAutoApprove) {
        await fetch('/api/admin/update-submission', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: currentBandId, collection: 'band_applications', status: 'approved' }),
        });
      }

      var res = await fetch('/api/admin/assign-band', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'assign', bandId: currentBandId, shellId: selected.value }),
      });

      if (res.ok) {
        window.location.reload();
      } else {
        var data = await res.json();
        if (assignError) {
          assignError.textContent = data.error || 'Assignment failed.';
          assignError.hidden = false;
        }
        assignSubmit.disabled = false;
        assignSubmit.textContent = 'Assign Date';
      }
    });
  }

  // Status change dropdown
  document.querySelectorAll('.status-select').forEach(function(sel) {
    sel.addEventListener('change', async function() {
      var newStatus = sel.value;
      if (!newStatus) return;
      var bandName = sel.dataset.bandName || 'this band';
      var labels = { good_standing: 'Good Standing', rejected: 'Rejected', approved: 'Approved' };
      if (!confirm('Change ' + bandName + ' to ' + (labels[newStatus] || newStatus) + '?')) {
        sel.value = '';
        return;
      }
      sel.disabled = true;
      var res = await fetch('/api/admin/update-submission', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: sel.dataset.bandId, collection: 'band_applications', status: newStatus }),
      });
      if (res.ok) window.location.reload();
      else { alert('Action failed.'); sel.disabled = false; sel.value = ''; }
    });
  });

  // Delete band
  document.querySelectorAll('.delete-btn').forEach(function(btn) {
    btn.addEventListener('click', async function() {
      var name = btn.dataset.bandName || 'this band';
      if (!confirm('Permanently delete ' + name + '? This cannot be undone.')) return;
      btn.disabled = true;
      btn.textContent = 'Deleting…';

      // If assigned to a shell, unassign first so the date opens back up
      var shellId = btn.dataset.assignedShell;
      if (shellId) {
        await fetch('/api/admin/assign-band', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'unassign', shellId: shellId }),
        });
      }

      var res = await fetch('/api/admin/update-submission', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: btn.dataset.bandId, collection: 'band_applications', status: 'deleted' }),
      });
      if (res.ok) {
        // Remove the card from the page immediately
        var card = document.getElementById(btn.dataset.bandId);
        if (card) card.remove();
      } else {
        alert('Delete failed.');
        btn.disabled = false;
        btn.textContent = 'Delete';
      }
    });
  });

  // Unassign
  document.querySelectorAll('.unassign-btn').forEach(function(btn) {
    btn.addEventListener('click', async function() {
      if (!confirm('Remove date assignment for ' + (btn.dataset.bandName || 'this band') + '? The date will become available again.')) return;
      btn.disabled = true;
      var res = await fetch('/api/admin/assign-band', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'unassign', shellId: btn.dataset.shellId }),
      });
      if (res.ok) window.location.reload();
      else { alert('Unassign failed.'); btn.disabled = false; }
    });
  });
}

// Run after DOM is ready
if (document.readyState === 'loading') {
  window.addEventListener('load', bandsInit);
} else {
  bandsInit();
}
