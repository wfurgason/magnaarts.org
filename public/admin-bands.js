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

  // Edit band — toggle form
  document.querySelectorAll('.edit-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      var bandId = btn.dataset.bandId;
      var form = document.getElementById('edit-' + bandId);
      if (!form) return;
      var isOpen = form.style.display !== 'none';
      form.style.display = isOpen ? 'none' : 'block';
      btn.textContent = isOpen ? '✏️ Edit' : 'Cancel Edit';
    });
  });

  // Edit — cancel
  document.querySelectorAll('.edit-cancel-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      var form = document.getElementById('edit-' + btn.dataset.bandId);
      if (form) form.style.display = 'none';
      var editBtn = document.querySelector('.edit-btn[data-band-id="' + btn.dataset.bandId + '"]');
      if (editBtn) editBtn.textContent = '✏️ Edit';
    });
  });

  // Edit — save
  document.querySelectorAll('.edit-save-btn').forEach(function(btn) {
    btn.addEventListener('click', async function() {
      var bandId = btn.dataset.bandId;
      var form = document.getElementById('edit-' + bandId);
      if (!form) return;

      var errEl = form.querySelector('.edit-error');
      if (errEl) errEl.style.display = 'none';
      btn.disabled = true;
      btn.textContent = 'Saving…';

      var fields = {};

      // Handle photo upload first (file input is kept separate)
      var photoInput = form.querySelector('input[type="file"][name="promo_photo_file"]');
      if (photoInput && photoInput.files && photoInput.files[0]) {
        btn.textContent = 'Uploading photo…';
        var photoForm = new FormData();
        photoForm.append('bandId', bandId);
        photoForm.append('file', photoInput.files[0]);
        var uploadRes = await fetch('/api/admin/upload-band-photo', {
          method: 'POST',
          body: photoForm,
        });
        if (!uploadRes.ok) {
          if (errEl) { errEl.textContent = 'Photo upload failed. Please try again.'; errEl.style.display = 'inline'; }
          btn.disabled = false;
          btn.textContent = 'Save Changes';
          return;
        }
        var uploadData = await uploadRes.json();
        if (uploadData.url) fields['promo_photo_url'] = uploadData.url;
        btn.textContent = 'Saving…';
      }

      // Collect all non-file named inputs
      form.querySelectorAll('input[name]:not([type="file"]), textarea[name]').forEach(function(el) {
        var name = el.name;
        if (el.type === 'checkbox') {
          fields[name] = el.checked;
        } else if (name === 'available_dates') {
          fields[name] = el.value.split(',').map(function(s) { return s.trim(); }).filter(Boolean);
        } else if (name === 'member_count') {
          fields[name] = el.value ? parseInt(el.value, 10) : null;
        } else {
          fields[name] = el.value.trim();
        }
      });

      var res = await fetch('/api/admin/update-band', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bandId: bandId, fields: fields }),
      });

      if (res.ok) {
        window.location.reload();
      } else {
        if (errEl) { errEl.textContent = 'Save failed. Please try again.'; errEl.style.display = 'inline'; }
        btn.disabled = false;
        btn.textContent = 'Save Changes';
      }
    });
  });

  // Approve button (pending bands)
  document.querySelectorAll('[data-action="approve"]').forEach(function(btn) {
    btn.addEventListener('click', async function() {
      btn.disabled = true;
      var res = await fetch('/api/admin/band-action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'approve', bandId: btn.dataset.id }),
      });
      if (res.ok) window.location.reload();
      else { alert('Action failed.'); btn.disabled = false; }
    });
  });

  // Reject button (pending bands) — opens modal
  document.querySelectorAll('[data-action="reject"]').forEach(function(btn) {
    btn.addEventListener('click', function() {
      openRejectModal(btn.dataset.id || '', btn.dataset.bandName || '');
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
        await fetch('/api/admin/band-action', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'approve', bandId: currentBandId }),
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
      var action = sel.value;
      if (!action) return;
      var bandId = sel.dataset.bandId || '';
      var bandName = sel.dataset.bandName || 'this band';

      if (action === 'reject') {
        sel.value = '';
        openRejectModal(bandId, bandName);
        return;
      }

      if (action === 'approve') {
        if (!confirm('Approve ' + bandName + '?')) { sel.value = ''; return; }
        sel.disabled = true;
        var res = await fetch('/api/admin/band-action', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'approve', bandId: bandId }),
        });
        if (res.ok) window.location.reload();
        else { alert('Action failed.'); sel.disabled = false; sel.value = ''; }
        return;
      }

      if (action === 'add-good-standing' || action === 'remove-good-standing') {
        var adding = action === 'add-good-standing';
        var msg = adding ? 'Mark ' + bandName + ' as Good Standing?' : 'Remove Good Standing from ' + bandName + '?';
        if (!confirm(msg)) { sel.value = ''; return; }
        sel.disabled = true;
        var res2 = await fetch('/api/admin/band-action', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'set-good-standing', bandId: bandId, value: adding }),
        });
        if (res2.ok) window.location.reload();
        else { alert('Action failed.'); sel.disabled = false; sel.value = ''; }
      }
    });
  });

  // Rejection modal
  var rejectModal      = document.getElementById('reject-modal');
  var rejectBandNameEl = document.getElementById('reject-band-name');
  var rejectNotesEl    = document.getElementById('reject-notes');
  var rejectError      = document.getElementById('reject-error');
  var rejectSubmit     = document.getElementById('reject-submit');
  var currentRejectBandId = '';

  function openRejectModal(bandId, bandName) {
    currentRejectBandId = bandId;
    if (rejectBandNameEl) rejectBandNameEl.textContent = bandName;
    if (rejectNotesEl) rejectNotesEl.value = '';
    if (rejectError) rejectError.hidden = true;
    if (rejectSubmit) { rejectSubmit.disabled = false; rejectSubmit.textContent = 'Reject Band'; }
    if (rejectModal) rejectModal.style.display = 'flex';
  }

  function closeRejectModal() {
    if (rejectModal) rejectModal.style.display = 'none';
    currentRejectBandId = '';
  }

  var rejectCloseBtn  = document.getElementById('reject-close');
  var rejectCancelBtn = document.getElementById('reject-cancel');
  if (rejectCloseBtn)  rejectCloseBtn.addEventListener('click', closeRejectModal);
  if (rejectCancelBtn) rejectCancelBtn.addEventListener('click', closeRejectModal);
  if (rejectModal) {
    rejectModal.addEventListener('click', function(e) {
      if (e.target === rejectModal) closeRejectModal();
    });
  }

  if (rejectSubmit) {
    rejectSubmit.addEventListener('click', async function() {
      if (!currentRejectBandId) return;
      rejectSubmit.disabled = true;
      rejectSubmit.textContent = 'Rejecting…';
      var notes = rejectNotesEl ? rejectNotesEl.value.trim() : '';
      var res = await fetch('/api/admin/band-action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reject', bandId: currentRejectBandId, notes: notes }),
      });
      if (res.ok) {
        window.location.reload();
      } else {
        if (rejectError) { rejectError.textContent = 'Rejection failed.'; rejectError.hidden = false; }
        rejectSubmit.disabled = false;
        rejectSubmit.textContent = 'Reject Band';
      }
    });
  }

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
