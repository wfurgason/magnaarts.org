import { c as createComponent } from './astro-component_CdpYp1nz.mjs';
import 'piccolore';
import { L as renderTemplate, b7 as defineScriptVars, a2 as addAttribute, x as maybeRenderHead } from './sequence_B8w407xz.mjs';
import { r as renderComponent } from './entrypoint_Diq9N73R.mjs';
import { $ as $$AdminLayout } from './AdminLayout_DI2FboVo.mjs';
import { adminDb } from './firebase-admin_xK7nQJo9.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a;
const $$Programs = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Programs;
  const user = Astro2.locals.user;
  const filterParam = Astro2.url.searchParams.get("filter") || "all";
  const snap = await adminDb.collection("program_submissions").orderBy("submittedAt", "desc").get();
  let programs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  if (filterParam !== "all") {
    programs = programs.filter((p) => (p.status || "pending") === filterParam);
  }
  const filters = ["all", "pending", "approved", "rejected", "published"];
  const firebaseConfig = {
    apiKey: "AIzaSyAP3QgOUeZ1ruwoUxOROvKw1JXpTxYAIQg",
    authDomain: "magnaarts.firebaseapp.com",
    projectId: "magnaarts",
    storageBucket: "magnaarts.firebasestorage.app",
    messagingSenderId: "1084773655627",
    appId: "1:1084773655627:web:3501bdbb5fbfb04952d9ce"
  };
  function getTitle(p) {
    return p.program_title || p.title || p.program_name || "(untitled)";
  }
  return renderTemplate`${renderComponent($$result, "AdminLayout", $$AdminLayout, { "title": "Program Proposals", "user": user, "data-astro-cid-ff6hqfmi": true }, { "default": async ($$result2) => renderTemplate(_a || (_a = __template([" ", '<div class="page-header" data-astro-cid-ff6hqfmi> <h1 data-astro-cid-ff6hqfmi>Program Proposals</h1> <div class="filter-tabs" data-astro-cid-ff6hqfmi> ', " </div> </div> ", ' <div id="edit-modal" class="modal-backdrop" style="display:none" role="dialog" aria-modal="true" data-astro-cid-ff6hqfmi> <div class="modal-box modal-wide" data-astro-cid-ff6hqfmi> <div class="modal-header" data-astro-cid-ff6hqfmi> <h2 data-astro-cid-ff6hqfmi>Edit Proposal</h2> <button id="edit-modal-close" class="modal-close" aria-label="Close" data-astro-cid-ff6hqfmi>✕</button> </div> <div class="modal-body" data-astro-cid-ff6hqfmi> <input type="hidden" id="edit-id" data-astro-cid-ff6hqfmi> <div class="modal-section-label" data-astro-cid-ff6hqfmi>Contact</div> <div class="modal-row two-col" data-astro-cid-ff6hqfmi> <div class="modal-field" data-astro-cid-ff6hqfmi> <label for="edit-contact-name" data-astro-cid-ff6hqfmi>Name</label> <input type="text" id="edit-contact-name" data-astro-cid-ff6hqfmi> </div> <div class="modal-field" data-astro-cid-ff6hqfmi> <label for="edit-contact-email" data-astro-cid-ff6hqfmi>Email</label> <input type="email" id="edit-contact-email" data-astro-cid-ff6hqfmi> </div> </div> <div class="modal-row two-col" data-astro-cid-ff6hqfmi> <div class="modal-field" data-astro-cid-ff6hqfmi> <label for="edit-contact-phone" data-astro-cid-ff6hqfmi>Phone</label> <input type="tel" id="edit-contact-phone" data-astro-cid-ff6hqfmi> </div> <div class="modal-field" data-astro-cid-ff6hqfmi> <label for="edit-connection" data-astro-cid-ff6hqfmi>Connection to Magna</label> <select id="edit-connection" data-astro-cid-ff6hqfmi> <option value="" data-astro-cid-ff6hqfmi>—</option> <option value="resident" data-astro-cid-ff6hqfmi>Resident</option> <option value="business" data-astro-cid-ff6hqfmi>Business owner/employee</option> <option value="school" data-astro-cid-ff6hqfmi>Works at a Magna school</option> <option value="organization" data-astro-cid-ff6hqfmi>Local organization</option> <option value="artist" data-astro-cid-ff6hqfmi>Artist / performer</option> <option value="other" data-astro-cid-ff6hqfmi>Other</option> </select> </div> </div> <div class="modal-section-label" data-astro-cid-ff6hqfmi>Proposal</div> <div class="modal-row two-col" data-astro-cid-ff6hqfmi> <div class="modal-field" data-astro-cid-ff6hqfmi> <label for="edit-program-title" data-astro-cid-ff6hqfmi>Working Title</label> <input type="text" id="edit-program-title" data-astro-cid-ff6hqfmi> </div> <div class="modal-field" data-astro-cid-ff6hqfmi> <label for="edit-event-type" data-astro-cid-ff6hqfmi>Event Type</label> <select id="edit-event-type" data-astro-cid-ff6hqfmi> <option value="" data-astro-cid-ff6hqfmi>—</option> <option value="concert" data-astro-cid-ff6hqfmi>Concert</option> <option value="class" data-astro-cid-ff6hqfmi>Art Class</option> <option value="film" data-astro-cid-ff6hqfmi>Film</option> <option value="festival" data-astro-cid-ff6hqfmi>Festival</option> <option value="other" data-astro-cid-ff6hqfmi>Other</option> </select> </div> </div> <div class="modal-field" data-astro-cid-ff6hqfmi> <label for="edit-description" data-astro-cid-ff6hqfmi>Description</label> <textarea id="edit-description" rows="4" data-astro-cid-ff6hqfmi></textarea> </div> <div class="modal-section-label" data-astro-cid-ff6hqfmi>Details</div> <div class="modal-row two-col" data-astro-cid-ff6hqfmi> <div class="modal-field" data-astro-cid-ff6hqfmi> <label for="edit-proposed-date" data-astro-cid-ff6hqfmi>Proposed Date</label> <input type="date" id="edit-proposed-date" data-astro-cid-ff6hqfmi> </div> <div class="modal-field" data-astro-cid-ff6hqfmi> <label for="edit-proposed-time" data-astro-cid-ff6hqfmi>Proposed Time</label> <input type="time" id="edit-proposed-time" data-astro-cid-ff6hqfmi> </div> </div> <div class="modal-row two-col" data-astro-cid-ff6hqfmi> <div class="modal-field" data-astro-cid-ff6hqfmi> <label for="edit-proposed-venue" data-astro-cid-ff6hqfmi>Preferred Location</label> <select id="edit-proposed-venue" data-astro-cid-ff6hqfmi> <option value="" data-astro-cid-ff6hqfmi>No preference / not sure yet</option> <option value="pleasant-green-park" data-astro-cid-ff6hqfmi>Pleasant Green Park</option> <option value="empress-theater" data-astro-cid-ff6hqfmi>Empress Theater</option> <option value="magna-library" data-astro-cid-ff6hqfmi>Magna Library</option> <option value="senior-center" data-astro-cid-ff6hqfmi>Magna Kennecott Senior Center</option> <option value="other" data-astro-cid-ff6hqfmi>Other</option> </select> </div> <div class="modal-field" data-astro-cid-ff6hqfmi> <label for="edit-estimated-attendance" data-astro-cid-ff6hqfmi>Est. Attendance</label> <select id="edit-estimated-attendance" data-astro-cid-ff6hqfmi> <option value="" data-astro-cid-ff6hqfmi>Not sure yet</option> <option value="under-50" data-astro-cid-ff6hqfmi>Under 50</option> <option value="50-200" data-astro-cid-ff6hqfmi>50–200</option> <option value="200-500" data-astro-cid-ff6hqfmi>200–500</option> <option value="500-plus" data-astro-cid-ff6hqfmi>500+</option> </select> </div> </div> <div class="modal-row two-col" data-astro-cid-ff6hqfmi> <div class="modal-field" data-astro-cid-ff6hqfmi> <label for="edit-budget" data-astro-cid-ff6hqfmi>Budget</label> <input type="text" id="edit-budget" placeholder="e.g. $500" data-astro-cid-ff6hqfmi> </div> <div class="modal-field" data-astro-cid-ff6hqfmi> <label for="edit-status" data-astro-cid-ff6hqfmi>Status</label> <select id="edit-status" data-astro-cid-ff6hqfmi> <option value="pending" data-astro-cid-ff6hqfmi>Pending</option> <option value="approved" data-astro-cid-ff6hqfmi>Approved</option> <option value="rejected" data-astro-cid-ff6hqfmi>Rejected</option> <option value="published" data-astro-cid-ff6hqfmi>Published</option> </select> </div> </div> <div class="modal-field" data-astro-cid-ff6hqfmi> <label for="edit-additional-notes" data-astro-cid-ff6hqfmi>Additional Notes</label> <textarea id="edit-additional-notes" rows="3" data-astro-cid-ff6hqfmi></textarea> </div> <div class="modal-section-label" data-astro-cid-ff6hqfmi>Program Image</div> <div id="edit-current-image-wrap" class="current-image-wrap" style="display:none" data-astro-cid-ff6hqfmi> <img id="edit-current-image" src="" alt="Current image" class="edit-current-img" data-astro-cid-ff6hqfmi> <button type="button" id="edit-remove-image" class="btn-remove-image" data-astro-cid-ff6hqfmi>Remove image</button> </div> <div class="modal-field" data-astro-cid-ff6hqfmi> <label for="edit-image-file" data-astro-cid-ff6hqfmi>Replace / Upload Image</label> <div class="upload-zone" id="editUploadZone" data-astro-cid-ff6hqfmi> <input type="file" id="edit-image-file" class="upload-input" accept="image/*" data-astro-cid-ff6hqfmi> <div class="upload-label" data-astro-cid-ff6hqfmi> <span class="upload-icon" data-astro-cid-ff6hqfmi>🖼️</span> <p class="upload-text" data-astro-cid-ff6hqfmi><strong data-astro-cid-ff6hqfmi>Click to upload</strong> or drag and drop</p> <p class="upload-hint" data-astro-cid-ff6hqfmi>JPG, PNG, WEBP · Max 5 MB</p> </div> </div> <div id="edit-image-preview" class="upload-preview" hidden data-astro-cid-ff6hqfmi></div> </div> <div id="edit-error" class="edit-error" hidden data-astro-cid-ff6hqfmi></div> </div> <div class="modal-actions" data-astro-cid-ff6hqfmi> <button id="edit-modal-cancel" class="btn btn-muted" data-astro-cid-ff6hqfmi>Cancel</button> <button id="edit-modal-save" class="btn btn-primary" data-astro-cid-ff6hqfmi>Save Changes</button> </div> </div> </div>  <div id="publish-modal" class="modal-backdrop" style="display:none" data-astro-cid-ff6hqfmi> <div class="modal-box" data-astro-cid-ff6hqfmi> <div class="modal-header" data-astro-cid-ff6hqfmi> <h2 data-astro-cid-ff6hqfmi>Publish Event</h2> <button id="modal-close" class="modal-close" data-astro-cid-ff6hqfmi>✕</button> </div> <form id="publish-form" novalidate data-astro-cid-ff6hqfmi> <input type="hidden" id="pub-submission-id" data-astro-cid-ff6hqfmi> <div class="form-row" data-astro-cid-ff6hqfmi> <div class="field-group" data-astro-cid-ff6hqfmi> <label for="pub-title" data-astro-cid-ff6hqfmi>Event Title *</label> <input type="text" id="pub-title" required data-astro-cid-ff6hqfmi> </div> </div> <div class="form-row two-col" data-astro-cid-ff6hqfmi> <div class="field-group" data-astro-cid-ff6hqfmi> <label for="pub-date" data-astro-cid-ff6hqfmi>Date *</label> <input type="date" id="pub-date" required data-astro-cid-ff6hqfmi> </div> <div class="field-group" data-astro-cid-ff6hqfmi> <label for="pub-time" data-astro-cid-ff6hqfmi>Time *</label> <input type="text" id="pub-time" placeholder="7:00 PM" required data-astro-cid-ff6hqfmi> </div> </div> <div class="form-row two-col" data-astro-cid-ff6hqfmi> <div class="field-group" data-astro-cid-ff6hqfmi> <label for="pub-venue" data-astro-cid-ff6hqfmi>Venue Name *</label> <input type="text" id="pub-venue" required data-astro-cid-ff6hqfmi> </div> <div class="field-group" data-astro-cid-ff6hqfmi> <label for="pub-address" data-astro-cid-ff6hqfmi>Venue Address *</label> <input type="text" id="pub-address" required data-astro-cid-ff6hqfmi> </div> </div> <div class="form-row two-col" data-astro-cid-ff6hqfmi> <div class="field-group" data-astro-cid-ff6hqfmi> <label for="pub-ticket" data-astro-cid-ff6hqfmi>Ticket URL</label> <input type="url" id="pub-ticket" placeholder="https://..." data-astro-cid-ff6hqfmi> </div> <div class="field-group" data-astro-cid-ff6hqfmi> <label for="pub-rsvp" data-astro-cid-ff6hqfmi>RSVP URL</label> <input type="url" id="pub-rsvp" placeholder="https://..." data-astro-cid-ff6hqfmi> </div> </div> <div class="form-row" data-astro-cid-ff6hqfmi> <div class="field-group" data-astro-cid-ff6hqfmi> <label for="pub-poster" data-astro-cid-ff6hqfmi>Event Poster URL</label> <input type="url" id="pub-poster" placeholder="https://..." data-astro-cid-ff6hqfmi> </div> </div> <div class="form-row" data-astro-cid-ff6hqfmi> <div class="field-group" data-astro-cid-ff6hqfmi> <label for="pub-desc" data-astro-cid-ff6hqfmi>Event Description *</label> <textarea id="pub-desc" rows="4" required data-astro-cid-ff6hqfmi></textarea> </div> </div> <div id="pub-error" class="error-msg" hidden data-astro-cid-ff6hqfmi></div> <div class="modal-actions" data-astro-cid-ff6hqfmi> <button type="button" id="modal-cancel" class="btn btn-ghost" data-astro-cid-ff6hqfmi>Cancel</button> <button type="submit" class="btn btn-primary" id="pub-submit" data-astro-cid-ff6hqfmi>Publish Event</button> </div> </form> </div> </div> <script>(function(){', `
    window.__FIREBASE_CONFIG__ = firebaseConfig;
  })();</script> <script type="module">
    import { initializeApp }  from 'https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js';
    import { getStorage, ref, uploadBytes, getDownloadURL } from 'https://www.gstatic.com/firebasejs/11.6.0/firebase-storage.js';

    const app     = initializeApp(window.__FIREBASE_CONFIG__);
    const storage = getStorage(app);

    function uniquePrefix() {
      return \`\${Date.now()}-\${Math.random().toString(36).slice(2, 8)}\`;
    }

    async function firebaseUpload(path, file) {
      const storageRef = ref(storage, path);
      await uploadBytes(storageRef, file);
      return getDownloadURL(storageRef);
    }

    // ── Delete actions ──────────────────────────────────────────────────────
    document.querySelectorAll('[data-action="delete"]').forEach(btn => {
      btn.addEventListener('click', async () => {
        const name = btn.dataset.name || 'this proposal';
        if (!confirm(\`Permanently delete "\${name}"? This cannot be undone.\`)) return;
        btn.disabled = true;
        btn.textContent = 'Deleting…';
        const res = await fetch('/api/admin/delete-proposal', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: btn.dataset.id }),
        });
        if (res.ok) {
          document.getElementById(\`card-\${btn.dataset.id}\`)?.remove();
        } else {
          alert('Delete failed.');
          btn.disabled = false;
          btn.textContent = 'Delete';
        }
      });
    });

    // ── Status actions (approve / reject) ─────────────────────────────────
    document.querySelectorAll('[data-action="approve"], [data-action="reject"]').forEach(btn => {
      btn.addEventListener('click', async () => {
        const el = btn;
        const status = el.dataset.action === 'approve' ? 'approved' : 'rejected';
        el.disabled = true;
        const res = await fetch('/api/admin/update-submission', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: el.dataset.id, collection: el.dataset.collection, status }),
        });
        if (res.ok) window.location.reload();
        else { alert('Action failed.'); el.disabled = false; }
      });
    });

    // ── Publish modal ──────────────────────────────────────────────────────
    const publishModal = document.getElementById('publish-modal');
    const publishForm  = document.getElementById('publish-form');

    document.querySelectorAll('[data-action="publish"]').forEach(btn => {
      btn.addEventListener('click', () => {
        const prog = JSON.parse(btn.dataset.prog || '{}');
        document.getElementById('pub-submission-id').value = btn.dataset.id;
        document.getElementById('pub-title').value   = prog.title || '';
        document.getElementById('pub-desc').value    = prog.description || '';
        if (prog.proposed_date)  document.getElementById('pub-date').value  = prog.proposed_date;
        if (prog.proposed_venue) document.getElementById('pub-venue').value = prog.proposed_venue;
        publishModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
      });
    });

    const closePublish = () => { 
      document.body.style.overflow = '';
      publishModal.style.display = 'none'; 
      publishForm.reset(); 
    };
    document.getElementById('modal-close')?.addEventListener('click', closePublish);
    document.getElementById('modal-cancel')?.addEventListener('click', closePublish);
    publishModal?.addEventListener('click', e => { if (e.target === publishModal) closePublish(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && publishModal.style.display !== 'none') closePublish(); });

    publishForm?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = document.getElementById('pub-submit');
      const errEl = document.getElementById('pub-error');
      errEl.hidden = true;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Publishing…';

      const res = await fetch('/api/admin/publish-event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          submissionId:  document.getElementById('pub-submission-id').value,
          submissionType: 'program',
          title:         document.getElementById('pub-title').value,
          eventDate:     document.getElementById('pub-date').value,
          eventTime:     document.getElementById('pub-time').value,
          venueName:     document.getElementById('pub-venue').value,
          venueAddress:  document.getElementById('pub-address').value,
          ticketUrl:     document.getElementById('pub-ticket').value,
          rsvpUrl:       document.getElementById('pub-rsvp').value,
          posterUrl:     document.getElementById('pub-poster').value,
          description:   document.getElementById('pub-desc').value,
        }),
      });

      if (res.ok) {
        window.location.href = '/admin/events';
      } else {
        const { error } = await res.json();
        errEl.textContent = error || 'Publish failed.';
        errEl.hidden = false;
        submitBtn.disabled = false;
        submitBtn.textContent = 'Publish Event';
      }
    });

    // ── Edit modal ─────────────────────────────────────────────────────────
    const editModal = document.getElementById('edit-modal');
    let currentImageUrl = '';
    let removeImage = false;

    // Upload zone drag-and-drop
    const editUploadZone = document.getElementById('editUploadZone');
    if (editUploadZone) {
      editUploadZone.addEventListener('dragover', e => { e.preventDefault(); editUploadZone.classList.add('drag-over'); });
      editUploadZone.addEventListener('dragleave', () => editUploadZone.classList.remove('drag-over'));
      editUploadZone.addEventListener('drop', e => {
        e.preventDefault();
        editUploadZone.classList.remove('drag-over');
        const input = editUploadZone.querySelector('.upload-input');
        if (input && e.dataTransfer?.files.length) {
          const dt = new DataTransfer();
          dt.items.add(e.dataTransfer.files[0]);
          input.files = dt.files;
          input.dispatchEvent(new Event('change'));
        }
      });
    }

    // Image preview in edit modal
    const editImageInput   = document.getElementById('edit-image-file');
    const editImagePreview = document.getElementById('edit-image-preview');
    editImageInput?.addEventListener('change', () => {
      const file = editImageInput.files && editImageInput.files[0];
      if (!file) { editImagePreview.hidden = true; return; }
      // Hide the current image wrap — the new upload will replace it
      document.getElementById('edit-current-image-wrap').style.display = 'none';
      removeImage = false; // new file takes precedence; don't explicitly null out
      const reader = new FileReader();
      reader.onload = ev => {
        editImagePreview.hidden = false;
        editImagePreview.innerHTML = \`<img src="\${ev.target.result}" alt="Preview" style="width:44px;height:44px;object-fit:cover;border-radius:5px;flex-shrink:0;" /><span>\${file.name} (\${(file.size/1024/1024).toFixed(1)} MB)</span>\`;
      };
      reader.readAsDataURL(file);
    });

    // Remove current image
    document.getElementById('edit-remove-image')?.addEventListener('click', () => {
      removeImage = true;
      currentImageUrl = '';
      document.getElementById('edit-current-image-wrap').style.display = 'none';
    });

    // Open edit modal
    document.querySelectorAll('[data-action="edit"]').forEach(btn => {
      btn.addEventListener('click', () => {
        const prog = JSON.parse(btn.dataset.prog || '{}');
        document.getElementById('edit-id').value                       = btn.dataset.id;
        document.getElementById('edit-contact-name').value            = prog.contact_name;
        document.getElementById('edit-contact-email').value           = prog.contact_email;
        document.getElementById('edit-contact-phone').value           = prog.contact_phone;
        document.getElementById('edit-connection').value              = prog.connection;
        document.getElementById('edit-event-type').value              = prog.event_type;
        document.getElementById('edit-program-title').value           = prog.program_title;
        document.getElementById('edit-description').value             = prog.description;
        document.getElementById('edit-proposed-date').value           = prog.proposed_date;
        document.getElementById('edit-proposed-time').value           = prog.proposed_time;
        document.getElementById('edit-proposed-venue').value          = prog.proposed_venue;
        document.getElementById('edit-estimated-attendance').value    = prog.estimated_attendance;
        document.getElementById('edit-budget').value                  = prog.budget;
        document.getElementById('edit-status').value                  = prog.status;
        document.getElementById('edit-additional-notes').value        = prog.additional_notes;

        // Reset image state
        removeImage = false;
        currentImageUrl = prog.image_url || '';
        editImageInput.value = '';
        editImagePreview.hidden = true;
        editImagePreview.innerHTML = '';

        const imgWrap = document.getElementById('edit-current-image-wrap');
        const imgEl   = document.getElementById('edit-current-image');
        if (currentImageUrl) {
          imgEl.src = currentImageUrl;
          imgWrap.style.display = 'flex';
        } else {
          imgWrap.style.display = 'none';
        }

        document.getElementById('edit-error').hidden = true;
        editModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
      });
    });

    // Close edit modal
    const closeEdit = () => {
      document.body.style.overflow = '';
      editModal.style.display = 'none';
      editImageInput.value = '';
      editImagePreview.hidden = true;
    };
    document.getElementById('edit-modal-close')?.addEventListener('click', closeEdit);
    document.getElementById('edit-modal-cancel')?.addEventListener('click', closeEdit);
    editModal?.addEventListener('click', e => { if (e.target === editModal) closeEdit(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && editModal.style.display !== 'none') closeEdit(); });

    // Save edit
    document.getElementById('edit-modal-save')?.addEventListener('click', async () => {
      const saveBtn = document.getElementById('edit-modal-save');
      const errorEl = document.getElementById('edit-error');
      errorEl.hidden = true;
      saveBtn.disabled = true;
      saveBtn.textContent = 'Saving…';

      try {
        // Handle image: upload new, keep existing, or clear
        let image_url = currentImageUrl;
        const newFile = editImageInput.files && editImageInput.files[0];
        if (newFile) {
          saveBtn.textContent = 'Uploading image…';
          const prefix = uniquePrefix();
          const ext = newFile.name.split('.').pop();
          image_url = await firebaseUpload(\`proposal-images/\${prefix}/image.\${ext}\`, newFile);
        } else if (removeImage) {
          image_url = null;
        }

        const id = document.getElementById('edit-id').value;
        const res = await fetch('/api/admin/update-proposal', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id,
            contact_name:         document.getElementById('edit-contact-name').value.trim(),
            contact_email:        document.getElementById('edit-contact-email').value.trim(),
            contact_phone:        document.getElementById('edit-contact-phone').value.trim(),
            connection:           document.getElementById('edit-connection').value,
            event_type:           document.getElementById('edit-event-type').value,
            program_title:        document.getElementById('edit-program-title').value.trim(),
            description:          document.getElementById('edit-description').value.trim(),
            proposed_date:        document.getElementById('edit-proposed-date').value,
            proposed_time:        document.getElementById('edit-proposed-time').value,
            proposed_venue:       document.getElementById('edit-proposed-venue').value,
            estimated_attendance: document.getElementById('edit-estimated-attendance').value,
            budget:               document.getElementById('edit-budget').value.trim(),
            status:               document.getElementById('edit-status').value,
            additional_notes:     document.getElementById('edit-additional-notes').value.trim(),
            image_url,
          }),
        });

        if (res.ok) {
          window.location.reload();
        } else {
          const { error } = await res.json();
          errorEl.textContent = error || 'Save failed. Please try again.';
          errorEl.hidden = false;
          saveBtn.disabled = false;
          saveBtn.textContent = 'Save Changes';
        }
      } catch (err) {
        errorEl.textContent = 'Network error. Please try again.';
        errorEl.hidden = false;
        saveBtn.disabled = false;
        saveBtn.textContent = 'Save Changes';
      }
    });
  </script> `], [" ", '<div class="page-header" data-astro-cid-ff6hqfmi> <h1 data-astro-cid-ff6hqfmi>Program Proposals</h1> <div class="filter-tabs" data-astro-cid-ff6hqfmi> ', " </div> </div> ", ' <div id="edit-modal" class="modal-backdrop" style="display:none" role="dialog" aria-modal="true" data-astro-cid-ff6hqfmi> <div class="modal-box modal-wide" data-astro-cid-ff6hqfmi> <div class="modal-header" data-astro-cid-ff6hqfmi> <h2 data-astro-cid-ff6hqfmi>Edit Proposal</h2> <button id="edit-modal-close" class="modal-close" aria-label="Close" data-astro-cid-ff6hqfmi>✕</button> </div> <div class="modal-body" data-astro-cid-ff6hqfmi> <input type="hidden" id="edit-id" data-astro-cid-ff6hqfmi> <div class="modal-section-label" data-astro-cid-ff6hqfmi>Contact</div> <div class="modal-row two-col" data-astro-cid-ff6hqfmi> <div class="modal-field" data-astro-cid-ff6hqfmi> <label for="edit-contact-name" data-astro-cid-ff6hqfmi>Name</label> <input type="text" id="edit-contact-name" data-astro-cid-ff6hqfmi> </div> <div class="modal-field" data-astro-cid-ff6hqfmi> <label for="edit-contact-email" data-astro-cid-ff6hqfmi>Email</label> <input type="email" id="edit-contact-email" data-astro-cid-ff6hqfmi> </div> </div> <div class="modal-row two-col" data-astro-cid-ff6hqfmi> <div class="modal-field" data-astro-cid-ff6hqfmi> <label for="edit-contact-phone" data-astro-cid-ff6hqfmi>Phone</label> <input type="tel" id="edit-contact-phone" data-astro-cid-ff6hqfmi> </div> <div class="modal-field" data-astro-cid-ff6hqfmi> <label for="edit-connection" data-astro-cid-ff6hqfmi>Connection to Magna</label> <select id="edit-connection" data-astro-cid-ff6hqfmi> <option value="" data-astro-cid-ff6hqfmi>—</option> <option value="resident" data-astro-cid-ff6hqfmi>Resident</option> <option value="business" data-astro-cid-ff6hqfmi>Business owner/employee</option> <option value="school" data-astro-cid-ff6hqfmi>Works at a Magna school</option> <option value="organization" data-astro-cid-ff6hqfmi>Local organization</option> <option value="artist" data-astro-cid-ff6hqfmi>Artist / performer</option> <option value="other" data-astro-cid-ff6hqfmi>Other</option> </select> </div> </div> <div class="modal-section-label" data-astro-cid-ff6hqfmi>Proposal</div> <div class="modal-row two-col" data-astro-cid-ff6hqfmi> <div class="modal-field" data-astro-cid-ff6hqfmi> <label for="edit-program-title" data-astro-cid-ff6hqfmi>Working Title</label> <input type="text" id="edit-program-title" data-astro-cid-ff6hqfmi> </div> <div class="modal-field" data-astro-cid-ff6hqfmi> <label for="edit-event-type" data-astro-cid-ff6hqfmi>Event Type</label> <select id="edit-event-type" data-astro-cid-ff6hqfmi> <option value="" data-astro-cid-ff6hqfmi>—</option> <option value="concert" data-astro-cid-ff6hqfmi>Concert</option> <option value="class" data-astro-cid-ff6hqfmi>Art Class</option> <option value="film" data-astro-cid-ff6hqfmi>Film</option> <option value="festival" data-astro-cid-ff6hqfmi>Festival</option> <option value="other" data-astro-cid-ff6hqfmi>Other</option> </select> </div> </div> <div class="modal-field" data-astro-cid-ff6hqfmi> <label for="edit-description" data-astro-cid-ff6hqfmi>Description</label> <textarea id="edit-description" rows="4" data-astro-cid-ff6hqfmi></textarea> </div> <div class="modal-section-label" data-astro-cid-ff6hqfmi>Details</div> <div class="modal-row two-col" data-astro-cid-ff6hqfmi> <div class="modal-field" data-astro-cid-ff6hqfmi> <label for="edit-proposed-date" data-astro-cid-ff6hqfmi>Proposed Date</label> <input type="date" id="edit-proposed-date" data-astro-cid-ff6hqfmi> </div> <div class="modal-field" data-astro-cid-ff6hqfmi> <label for="edit-proposed-time" data-astro-cid-ff6hqfmi>Proposed Time</label> <input type="time" id="edit-proposed-time" data-astro-cid-ff6hqfmi> </div> </div> <div class="modal-row two-col" data-astro-cid-ff6hqfmi> <div class="modal-field" data-astro-cid-ff6hqfmi> <label for="edit-proposed-venue" data-astro-cid-ff6hqfmi>Preferred Location</label> <select id="edit-proposed-venue" data-astro-cid-ff6hqfmi> <option value="" data-astro-cid-ff6hqfmi>No preference / not sure yet</option> <option value="pleasant-green-park" data-astro-cid-ff6hqfmi>Pleasant Green Park</option> <option value="empress-theater" data-astro-cid-ff6hqfmi>Empress Theater</option> <option value="magna-library" data-astro-cid-ff6hqfmi>Magna Library</option> <option value="senior-center" data-astro-cid-ff6hqfmi>Magna Kennecott Senior Center</option> <option value="other" data-astro-cid-ff6hqfmi>Other</option> </select> </div> <div class="modal-field" data-astro-cid-ff6hqfmi> <label for="edit-estimated-attendance" data-astro-cid-ff6hqfmi>Est. Attendance</label> <select id="edit-estimated-attendance" data-astro-cid-ff6hqfmi> <option value="" data-astro-cid-ff6hqfmi>Not sure yet</option> <option value="under-50" data-astro-cid-ff6hqfmi>Under 50</option> <option value="50-200" data-astro-cid-ff6hqfmi>50–200</option> <option value="200-500" data-astro-cid-ff6hqfmi>200–500</option> <option value="500-plus" data-astro-cid-ff6hqfmi>500+</option> </select> </div> </div> <div class="modal-row two-col" data-astro-cid-ff6hqfmi> <div class="modal-field" data-astro-cid-ff6hqfmi> <label for="edit-budget" data-astro-cid-ff6hqfmi>Budget</label> <input type="text" id="edit-budget" placeholder="e.g. $500" data-astro-cid-ff6hqfmi> </div> <div class="modal-field" data-astro-cid-ff6hqfmi> <label for="edit-status" data-astro-cid-ff6hqfmi>Status</label> <select id="edit-status" data-astro-cid-ff6hqfmi> <option value="pending" data-astro-cid-ff6hqfmi>Pending</option> <option value="approved" data-astro-cid-ff6hqfmi>Approved</option> <option value="rejected" data-astro-cid-ff6hqfmi>Rejected</option> <option value="published" data-astro-cid-ff6hqfmi>Published</option> </select> </div> </div> <div class="modal-field" data-astro-cid-ff6hqfmi> <label for="edit-additional-notes" data-astro-cid-ff6hqfmi>Additional Notes</label> <textarea id="edit-additional-notes" rows="3" data-astro-cid-ff6hqfmi></textarea> </div> <div class="modal-section-label" data-astro-cid-ff6hqfmi>Program Image</div> <div id="edit-current-image-wrap" class="current-image-wrap" style="display:none" data-astro-cid-ff6hqfmi> <img id="edit-current-image" src="" alt="Current image" class="edit-current-img" data-astro-cid-ff6hqfmi> <button type="button" id="edit-remove-image" class="btn-remove-image" data-astro-cid-ff6hqfmi>Remove image</button> </div> <div class="modal-field" data-astro-cid-ff6hqfmi> <label for="edit-image-file" data-astro-cid-ff6hqfmi>Replace / Upload Image</label> <div class="upload-zone" id="editUploadZone" data-astro-cid-ff6hqfmi> <input type="file" id="edit-image-file" class="upload-input" accept="image/*" data-astro-cid-ff6hqfmi> <div class="upload-label" data-astro-cid-ff6hqfmi> <span class="upload-icon" data-astro-cid-ff6hqfmi>🖼️</span> <p class="upload-text" data-astro-cid-ff6hqfmi><strong data-astro-cid-ff6hqfmi>Click to upload</strong> or drag and drop</p> <p class="upload-hint" data-astro-cid-ff6hqfmi>JPG, PNG, WEBP · Max 5 MB</p> </div> </div> <div id="edit-image-preview" class="upload-preview" hidden data-astro-cid-ff6hqfmi></div> </div> <div id="edit-error" class="edit-error" hidden data-astro-cid-ff6hqfmi></div> </div> <div class="modal-actions" data-astro-cid-ff6hqfmi> <button id="edit-modal-cancel" class="btn btn-muted" data-astro-cid-ff6hqfmi>Cancel</button> <button id="edit-modal-save" class="btn btn-primary" data-astro-cid-ff6hqfmi>Save Changes</button> </div> </div> </div>  <div id="publish-modal" class="modal-backdrop" style="display:none" data-astro-cid-ff6hqfmi> <div class="modal-box" data-astro-cid-ff6hqfmi> <div class="modal-header" data-astro-cid-ff6hqfmi> <h2 data-astro-cid-ff6hqfmi>Publish Event</h2> <button id="modal-close" class="modal-close" data-astro-cid-ff6hqfmi>✕</button> </div> <form id="publish-form" novalidate data-astro-cid-ff6hqfmi> <input type="hidden" id="pub-submission-id" data-astro-cid-ff6hqfmi> <div class="form-row" data-astro-cid-ff6hqfmi> <div class="field-group" data-astro-cid-ff6hqfmi> <label for="pub-title" data-astro-cid-ff6hqfmi>Event Title *</label> <input type="text" id="pub-title" required data-astro-cid-ff6hqfmi> </div> </div> <div class="form-row two-col" data-astro-cid-ff6hqfmi> <div class="field-group" data-astro-cid-ff6hqfmi> <label for="pub-date" data-astro-cid-ff6hqfmi>Date *</label> <input type="date" id="pub-date" required data-astro-cid-ff6hqfmi> </div> <div class="field-group" data-astro-cid-ff6hqfmi> <label for="pub-time" data-astro-cid-ff6hqfmi>Time *</label> <input type="text" id="pub-time" placeholder="7:00 PM" required data-astro-cid-ff6hqfmi> </div> </div> <div class="form-row two-col" data-astro-cid-ff6hqfmi> <div class="field-group" data-astro-cid-ff6hqfmi> <label for="pub-venue" data-astro-cid-ff6hqfmi>Venue Name *</label> <input type="text" id="pub-venue" required data-astro-cid-ff6hqfmi> </div> <div class="field-group" data-astro-cid-ff6hqfmi> <label for="pub-address" data-astro-cid-ff6hqfmi>Venue Address *</label> <input type="text" id="pub-address" required data-astro-cid-ff6hqfmi> </div> </div> <div class="form-row two-col" data-astro-cid-ff6hqfmi> <div class="field-group" data-astro-cid-ff6hqfmi> <label for="pub-ticket" data-astro-cid-ff6hqfmi>Ticket URL</label> <input type="url" id="pub-ticket" placeholder="https://..." data-astro-cid-ff6hqfmi> </div> <div class="field-group" data-astro-cid-ff6hqfmi> <label for="pub-rsvp" data-astro-cid-ff6hqfmi>RSVP URL</label> <input type="url" id="pub-rsvp" placeholder="https://..." data-astro-cid-ff6hqfmi> </div> </div> <div class="form-row" data-astro-cid-ff6hqfmi> <div class="field-group" data-astro-cid-ff6hqfmi> <label for="pub-poster" data-astro-cid-ff6hqfmi>Event Poster URL</label> <input type="url" id="pub-poster" placeholder="https://..." data-astro-cid-ff6hqfmi> </div> </div> <div class="form-row" data-astro-cid-ff6hqfmi> <div class="field-group" data-astro-cid-ff6hqfmi> <label for="pub-desc" data-astro-cid-ff6hqfmi>Event Description *</label> <textarea id="pub-desc" rows="4" required data-astro-cid-ff6hqfmi></textarea> </div> </div> <div id="pub-error" class="error-msg" hidden data-astro-cid-ff6hqfmi></div> <div class="modal-actions" data-astro-cid-ff6hqfmi> <button type="button" id="modal-cancel" class="btn btn-ghost" data-astro-cid-ff6hqfmi>Cancel</button> <button type="submit" class="btn btn-primary" id="pub-submit" data-astro-cid-ff6hqfmi>Publish Event</button> </div> </form> </div> </div> <script>(function(){', `
    window.__FIREBASE_CONFIG__ = firebaseConfig;
  })();</script> <script type="module">
    import { initializeApp }  from 'https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js';
    import { getStorage, ref, uploadBytes, getDownloadURL } from 'https://www.gstatic.com/firebasejs/11.6.0/firebase-storage.js';

    const app     = initializeApp(window.__FIREBASE_CONFIG__);
    const storage = getStorage(app);

    function uniquePrefix() {
      return \\\`\\\${Date.now()}-\\\${Math.random().toString(36).slice(2, 8)}\\\`;
    }

    async function firebaseUpload(path, file) {
      const storageRef = ref(storage, path);
      await uploadBytes(storageRef, file);
      return getDownloadURL(storageRef);
    }

    // ── Delete actions ──────────────────────────────────────────────────────
    document.querySelectorAll('[data-action="delete"]').forEach(btn => {
      btn.addEventListener('click', async () => {
        const name = btn.dataset.name || 'this proposal';
        if (!confirm(\\\`Permanently delete "\\\${name}"? This cannot be undone.\\\`)) return;
        btn.disabled = true;
        btn.textContent = 'Deleting…';
        const res = await fetch('/api/admin/delete-proposal', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: btn.dataset.id }),
        });
        if (res.ok) {
          document.getElementById(\\\`card-\\\${btn.dataset.id}\\\`)?.remove();
        } else {
          alert('Delete failed.');
          btn.disabled = false;
          btn.textContent = 'Delete';
        }
      });
    });

    // ── Status actions (approve / reject) ─────────────────────────────────
    document.querySelectorAll('[data-action="approve"], [data-action="reject"]').forEach(btn => {
      btn.addEventListener('click', async () => {
        const el = btn;
        const status = el.dataset.action === 'approve' ? 'approved' : 'rejected';
        el.disabled = true;
        const res = await fetch('/api/admin/update-submission', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: el.dataset.id, collection: el.dataset.collection, status }),
        });
        if (res.ok) window.location.reload();
        else { alert('Action failed.'); el.disabled = false; }
      });
    });

    // ── Publish modal ──────────────────────────────────────────────────────
    const publishModal = document.getElementById('publish-modal');
    const publishForm  = document.getElementById('publish-form');

    document.querySelectorAll('[data-action="publish"]').forEach(btn => {
      btn.addEventListener('click', () => {
        const prog = JSON.parse(btn.dataset.prog || '{}');
        document.getElementById('pub-submission-id').value = btn.dataset.id;
        document.getElementById('pub-title').value   = prog.title || '';
        document.getElementById('pub-desc').value    = prog.description || '';
        if (prog.proposed_date)  document.getElementById('pub-date').value  = prog.proposed_date;
        if (prog.proposed_venue) document.getElementById('pub-venue').value = prog.proposed_venue;
        publishModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
      });
    });

    const closePublish = () => { 
      document.body.style.overflow = '';
      publishModal.style.display = 'none'; 
      publishForm.reset(); 
    };
    document.getElementById('modal-close')?.addEventListener('click', closePublish);
    document.getElementById('modal-cancel')?.addEventListener('click', closePublish);
    publishModal?.addEventListener('click', e => { if (e.target === publishModal) closePublish(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && publishModal.style.display !== 'none') closePublish(); });

    publishForm?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = document.getElementById('pub-submit');
      const errEl = document.getElementById('pub-error');
      errEl.hidden = true;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Publishing…';

      const res = await fetch('/api/admin/publish-event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          submissionId:  document.getElementById('pub-submission-id').value,
          submissionType: 'program',
          title:         document.getElementById('pub-title').value,
          eventDate:     document.getElementById('pub-date').value,
          eventTime:     document.getElementById('pub-time').value,
          venueName:     document.getElementById('pub-venue').value,
          venueAddress:  document.getElementById('pub-address').value,
          ticketUrl:     document.getElementById('pub-ticket').value,
          rsvpUrl:       document.getElementById('pub-rsvp').value,
          posterUrl:     document.getElementById('pub-poster').value,
          description:   document.getElementById('pub-desc').value,
        }),
      });

      if (res.ok) {
        window.location.href = '/admin/events';
      } else {
        const { error } = await res.json();
        errEl.textContent = error || 'Publish failed.';
        errEl.hidden = false;
        submitBtn.disabled = false;
        submitBtn.textContent = 'Publish Event';
      }
    });

    // ── Edit modal ─────────────────────────────────────────────────────────
    const editModal = document.getElementById('edit-modal');
    let currentImageUrl = '';
    let removeImage = false;

    // Upload zone drag-and-drop
    const editUploadZone = document.getElementById('editUploadZone');
    if (editUploadZone) {
      editUploadZone.addEventListener('dragover', e => { e.preventDefault(); editUploadZone.classList.add('drag-over'); });
      editUploadZone.addEventListener('dragleave', () => editUploadZone.classList.remove('drag-over'));
      editUploadZone.addEventListener('drop', e => {
        e.preventDefault();
        editUploadZone.classList.remove('drag-over');
        const input = editUploadZone.querySelector('.upload-input');
        if (input && e.dataTransfer?.files.length) {
          const dt = new DataTransfer();
          dt.items.add(e.dataTransfer.files[0]);
          input.files = dt.files;
          input.dispatchEvent(new Event('change'));
        }
      });
    }

    // Image preview in edit modal
    const editImageInput   = document.getElementById('edit-image-file');
    const editImagePreview = document.getElementById('edit-image-preview');
    editImageInput?.addEventListener('change', () => {
      const file = editImageInput.files && editImageInput.files[0];
      if (!file) { editImagePreview.hidden = true; return; }
      // Hide the current image wrap — the new upload will replace it
      document.getElementById('edit-current-image-wrap').style.display = 'none';
      removeImage = false; // new file takes precedence; don't explicitly null out
      const reader = new FileReader();
      reader.onload = ev => {
        editImagePreview.hidden = false;
        editImagePreview.innerHTML = \\\`<img src="\\\${ev.target.result}" alt="Preview" style="width:44px;height:44px;object-fit:cover;border-radius:5px;flex-shrink:0;" /><span>\\\${file.name} (\\\${(file.size/1024/1024).toFixed(1)} MB)</span>\\\`;
      };
      reader.readAsDataURL(file);
    });

    // Remove current image
    document.getElementById('edit-remove-image')?.addEventListener('click', () => {
      removeImage = true;
      currentImageUrl = '';
      document.getElementById('edit-current-image-wrap').style.display = 'none';
    });

    // Open edit modal
    document.querySelectorAll('[data-action="edit"]').forEach(btn => {
      btn.addEventListener('click', () => {
        const prog = JSON.parse(btn.dataset.prog || '{}');
        document.getElementById('edit-id').value                       = btn.dataset.id;
        document.getElementById('edit-contact-name').value            = prog.contact_name;
        document.getElementById('edit-contact-email').value           = prog.contact_email;
        document.getElementById('edit-contact-phone').value           = prog.contact_phone;
        document.getElementById('edit-connection').value              = prog.connection;
        document.getElementById('edit-event-type').value              = prog.event_type;
        document.getElementById('edit-program-title').value           = prog.program_title;
        document.getElementById('edit-description').value             = prog.description;
        document.getElementById('edit-proposed-date').value           = prog.proposed_date;
        document.getElementById('edit-proposed-time').value           = prog.proposed_time;
        document.getElementById('edit-proposed-venue').value          = prog.proposed_venue;
        document.getElementById('edit-estimated-attendance').value    = prog.estimated_attendance;
        document.getElementById('edit-budget').value                  = prog.budget;
        document.getElementById('edit-status').value                  = prog.status;
        document.getElementById('edit-additional-notes').value        = prog.additional_notes;

        // Reset image state
        removeImage = false;
        currentImageUrl = prog.image_url || '';
        editImageInput.value = '';
        editImagePreview.hidden = true;
        editImagePreview.innerHTML = '';

        const imgWrap = document.getElementById('edit-current-image-wrap');
        const imgEl   = document.getElementById('edit-current-image');
        if (currentImageUrl) {
          imgEl.src = currentImageUrl;
          imgWrap.style.display = 'flex';
        } else {
          imgWrap.style.display = 'none';
        }

        document.getElementById('edit-error').hidden = true;
        editModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
      });
    });

    // Close edit modal
    const closeEdit = () => {
      document.body.style.overflow = '';
      editModal.style.display = 'none';
      editImageInput.value = '';
      editImagePreview.hidden = true;
    };
    document.getElementById('edit-modal-close')?.addEventListener('click', closeEdit);
    document.getElementById('edit-modal-cancel')?.addEventListener('click', closeEdit);
    editModal?.addEventListener('click', e => { if (e.target === editModal) closeEdit(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && editModal.style.display !== 'none') closeEdit(); });

    // Save edit
    document.getElementById('edit-modal-save')?.addEventListener('click', async () => {
      const saveBtn = document.getElementById('edit-modal-save');
      const errorEl = document.getElementById('edit-error');
      errorEl.hidden = true;
      saveBtn.disabled = true;
      saveBtn.textContent = 'Saving…';

      try {
        // Handle image: upload new, keep existing, or clear
        let image_url = currentImageUrl;
        const newFile = editImageInput.files && editImageInput.files[0];
        if (newFile) {
          saveBtn.textContent = 'Uploading image…';
          const prefix = uniquePrefix();
          const ext = newFile.name.split('.').pop();
          image_url = await firebaseUpload(\\\`proposal-images/\\\${prefix}/image.\\\${ext}\\\`, newFile);
        } else if (removeImage) {
          image_url = null;
        }

        const id = document.getElementById('edit-id').value;
        const res = await fetch('/api/admin/update-proposal', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id,
            contact_name:         document.getElementById('edit-contact-name').value.trim(),
            contact_email:        document.getElementById('edit-contact-email').value.trim(),
            contact_phone:        document.getElementById('edit-contact-phone').value.trim(),
            connection:           document.getElementById('edit-connection').value,
            event_type:           document.getElementById('edit-event-type').value,
            program_title:        document.getElementById('edit-program-title').value.trim(),
            description:          document.getElementById('edit-description').value.trim(),
            proposed_date:        document.getElementById('edit-proposed-date').value,
            proposed_time:        document.getElementById('edit-proposed-time').value,
            proposed_venue:       document.getElementById('edit-proposed-venue').value,
            estimated_attendance: document.getElementById('edit-estimated-attendance').value,
            budget:               document.getElementById('edit-budget').value.trim(),
            status:               document.getElementById('edit-status').value,
            additional_notes:     document.getElementById('edit-additional-notes').value.trim(),
            image_url,
          }),
        });

        if (res.ok) {
          window.location.reload();
        } else {
          const { error } = await res.json();
          errorEl.textContent = error || 'Save failed. Please try again.';
          errorEl.hidden = false;
          saveBtn.disabled = false;
          saveBtn.textContent = 'Save Changes';
        }
      } catch (err) {
        errorEl.textContent = 'Network error. Please try again.';
        errorEl.hidden = false;
        saveBtn.disabled = false;
        saveBtn.textContent = 'Save Changes';
      }
    });
  </script> `])), maybeRenderHead(), filters.map((f) => renderTemplate`<a${addAttribute(`/admin/programs${f === "all" ? "" : `?filter=${f}`}`, "href")}${addAttribute(["filter-tab", { active: filterParam === f }], "class:list")} data-astro-cid-ff6hqfmi> ${f.charAt(0).toUpperCase() + f.slice(1)} </a>`), programs.length === 0 ? renderTemplate`<div class="empty-state" data-astro-cid-ff6hqfmi> <p data-astro-cid-ff6hqfmi>No proposals matching this filter.</p> <p style="margin-top:8px;font-size:13px;" data-astro-cid-ff6hqfmi>Proposals come in through <a href="/propose" data-astro-cid-ff6hqfmi>/propose</a>.</p> </div>` : renderTemplate`<div class="submission-list" data-astro-cid-ff6hqfmi> ${programs.map((prog) => renderTemplate`<div class="submission-card"${addAttribute(`card-${prog.id}`, "id")} data-astro-cid-ff6hqfmi> <div class="submission-header" data-astro-cid-ff6hqfmi> <div data-astro-cid-ff6hqfmi> <h2 class="submission-name" data-astro-cid-ff6hqfmi>${getTitle(prog)}</h2> <span class="submission-meta" data-astro-cid-ff6hqfmi>${prog.contact_name} · ${prog.contact_email}</span> </div> <span${addAttribute(`badge badge-${prog.status || "pending"}`, "class")} data-astro-cid-ff6hqfmi>${prog.status || "pending"}</span> </div> <div class="submission-body" data-astro-cid-ff6hqfmi> ${prog.image_url && renderTemplate`<div class="proposal-image-wrap" data-astro-cid-ff6hqfmi> <img${addAttribute(prog.image_url, "src")}${addAttribute(`${getTitle(prog)} image`, "alt")} class="proposal-image" data-astro-cid-ff6hqfmi> </div>`} <div class="detail-grid" data-astro-cid-ff6hqfmi> <div data-astro-cid-ff6hqfmi> <div class="detail-label" data-astro-cid-ff6hqfmi>Contact</div> <div data-astro-cid-ff6hqfmi>${prog.contact_name}</div> <div data-astro-cid-ff6hqfmi><a${addAttribute(`mailto:${prog.contact_email}`, "href")} data-astro-cid-ff6hqfmi>${prog.contact_email}</a></div> ${prog.contact_phone && renderTemplate`<div data-astro-cid-ff6hqfmi>${prog.contact_phone}</div>`} </div> <div data-astro-cid-ff6hqfmi> <div class="detail-label" data-astro-cid-ff6hqfmi>Event Type</div> <div data-astro-cid-ff6hqfmi>${prog.event_type || "—"}</div> ${prog.connection && renderTemplate`<div style="margin-top:4px;font-size:12px;color:var(--muted);" data-astro-cid-ff6hqfmi>${prog.connection}</div>`} </div> ${prog.proposed_date && renderTemplate`<div data-astro-cid-ff6hqfmi> <div class="detail-label" data-astro-cid-ff6hqfmi>Proposed Date / Time</div> <div data-astro-cid-ff6hqfmi>${prog.proposed_date}${prog.proposed_time ? ` · ${prog.proposed_time}` : ""}</div> </div>`} ${prog.proposed_venue && renderTemplate`<div data-astro-cid-ff6hqfmi> <div class="detail-label" data-astro-cid-ff6hqfmi>Proposed Venue</div> <div data-astro-cid-ff6hqfmi>${prog.proposed_venue}</div> </div>`} ${prog.estimated_attendance && renderTemplate`<div data-astro-cid-ff6hqfmi> <div class="detail-label" data-astro-cid-ff6hqfmi>Est. Attendance</div> <div data-astro-cid-ff6hqfmi>${prog.estimated_attendance}</div> </div>`} ${prog.budget && renderTemplate`<div data-astro-cid-ff6hqfmi> <div class="detail-label" data-astro-cid-ff6hqfmi>Budget</div> <div data-astro-cid-ff6hqfmi>${prog.budget}</div> </div>`} </div> ${prog.description && renderTemplate`<div class="detail-bio" data-astro-cid-ff6hqfmi> <div class="detail-label" data-astro-cid-ff6hqfmi>Description</div> <p data-astro-cid-ff6hqfmi>${prog.description}</p> </div>`} ${prog.additional_notes && renderTemplate`<div class="detail-bio" data-astro-cid-ff6hqfmi> <div class="detail-label" data-astro-cid-ff6hqfmi>Additional Notes</div> <p data-astro-cid-ff6hqfmi>${prog.additional_notes}</p> </div>`} <div class="submitted-row" data-astro-cid-ff6hqfmi>
Submitted ${prog.submittedAt ? new Date(prog.submittedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—"} </div> </div> <div class="submission-actions" data-astro-cid-ff6hqfmi> ${prog.status !== "approved" && prog.status !== "published" && renderTemplate`<button class="btn btn-success" data-action="approve"${addAttribute(prog.id, "data-id")} data-collection="program_submissions" data-astro-cid-ff6hqfmi>
✓ Approve
</button>`} ${prog.status !== "rejected" && prog.status !== "published" && renderTemplate`<button class="btn btn-danger" data-action="reject"${addAttribute(prog.id, "data-id")} data-collection="program_submissions" data-astro-cid-ff6hqfmi>
Reject
</button>`} ${prog.status === "approved" && renderTemplate`<button class="btn btn-primary" data-action="publish"${addAttribute(prog.id, "data-id")}${addAttribute(JSON.stringify({
    title: getTitle(prog),
    description: prog.description || "",
    proposed_date: prog.proposed_date || "",
    proposed_venue: prog.proposed_venue || ""
  }), "data-prog")} data-astro-cid-ff6hqfmi>
Publish as Event
</button>`} <button class="btn btn-delete" data-action="delete"${addAttribute(prog.id, "data-id")}${addAttribute(getTitle(prog), "data-name")} data-astro-cid-ff6hqfmi>
Delete
</button> <button class="btn btn-edit" data-action="edit"${addAttribute(prog.id, "data-id")}${addAttribute(JSON.stringify({
    contact_name: prog.contact_name || "",
    contact_email: prog.contact_email || "",
    contact_phone: prog.contact_phone || "",
    connection: prog.connection || "",
    event_type: prog.event_type || "",
    program_title: getTitle(prog),
    description: prog.description || "",
    proposed_date: prog.proposed_date || "",
    proposed_time: prog.proposed_time || "",
    proposed_venue: prog.proposed_venue || "",
    estimated_attendance: prog.estimated_attendance || "",
    budget: prog.budget || "",
    additional_notes: prog.additional_notes || "",
    image_url: prog.image_url || "",
    status: prog.status || "pending"
  }), "data-prog")} data-astro-cid-ff6hqfmi>
✏️ Edit
</button> </div> </div>`)} </div>`, defineScriptVars({ firebaseConfig })) })}`;
}, "/Users/wfurgason/Documents/Arts Council/magnaarts.org/src/pages/admin/programs.astro", void 0);
const $$file = "/Users/wfurgason/Documents/Arts Council/magnaarts.org/src/pages/admin/programs.astro";
const $$url = "/admin/programs";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Programs,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
