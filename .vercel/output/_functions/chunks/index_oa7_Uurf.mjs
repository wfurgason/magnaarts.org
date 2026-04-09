import { r as renderComponent, s as spreadAttributes } from './entrypoint_Diq9N73R.mjs';
import { $ as $$BaseLayout, b as $$Footer, a as $$Header } from './global_Hoz3rGEv.mjs';
import { c as createComponent } from './astro-component_CdpYp1nz.mjs';
import { L as renderTemplate, b7 as defineScriptVars, a2 as addAttribute, x as maybeRenderHead } from './sequence_B8w407xz.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a;
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const firebaseConfig = {
    apiKey: "AIzaSyAP3QgOUeZ1ruwoUxOROvKw1JXpTxYAIQg",
    authDomain: "magnaarts.firebaseapp.com",
    projectId: "magnaarts"
  };
  const today = /* @__PURE__ */ new Date();
  today.setHours(0, 0, 0, 0);
  const featuredEvents = [
    {
      id: "lens-of-magna-2026",
      expiresDate: /* @__PURE__ */ new Date("2026-04-17T00:00:00"),
      // day after the April 16 exhibit
      href: "/lens-of-magna",
      badge: "3rd Annual · Photography Contest",
      accentColor: "featured-gold",
      icon: "📷",
      logoSrc: "/images/lens-of-magna/lmm-logo.png",
      title: "Lens of Magna 2026: Main Street in Motion",
      description: "A free community photography contest celebrating Magna Main Street. Submit your best shots for a chance to win a share of $2,875 in cash prizes — open to Youth, Amateur, and Professional photographers.",
      details: [
        { icon: "📅", label: "Entry Deadline", value: "Saturday, April 11, 2026" },
        { icon: "🖼️", label: "Exhibit & Reception", value: "Thursday, April 16, 2026 · 6:00–8:00 PM" },
        { icon: "📍", label: "Exhibit Location", value: "Magna Branch — Salt Lake County Library" },
        { icon: "🆓", label: "Entry Fee", value: "Free" }
      ],
      ctaText: "Learn More & Enter Free →",
      ctaExternal: false
    }
    // Add more featured events here following the same shape ↑
  ].filter((e) => {
    const exp = new Date(e.expiresDate);
    exp.setHours(0, 0, 0, 0);
    return today < exp;
  });
  const hasFeatured = featuredEvents.length > 0;
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "Events — Magna Arts Council", "description": "Upcoming events from the Magna Arts Council — free concerts, movies in the park, open mic nights, and the annual Arts Festival." }, { "default": async ($$result2) => renderTemplate(_a || (_a = __template([" ", " ", `<main> <!-- ── PAGE HERO ── --> <section class="page-hero"> <div class="container"> <h1>Free Events for Everyone</h1> <p class="hero-sub">
Every event is free and open to all. Bring a blanket, bring the family,
          and enjoy the best of Magna's arts community.
</p> </div> </section> <!-- ── FEATURED / PINNED EVENTS (static, date-gated) ── --> `, ` <!-- ── FIRESTORE PUBLISHED EVENTS — loaded client-side ── --> <section class="section published-events-section" id="live-events-section" style="display:none"> <div class="container"> <h2 class="section-title">Upcoming Events</h2> <div class="published-grid" id="live-events-grid"></div> </div> </section> <!-- ── SUMMER SERIES CALLOUT ── --> <section class="series-callout reveal"> <div class="container series-inner"> <div class="series-text"> <h2>Music &amp; Movies in the Park</h2> <p>Most Friday nights June through August. Live music starts at 8 PM, movie follows at dusk on our 35-ft inflatable screen.</p> <div class="series-details"> <span class="detail-pill">📍 Pleasant Green Park — 3250 S 8400 W, Magna</span> <span class="detail-pill">🗓 Most Fridays · June – August</span> <span class="detail-pill">🎟 Free Admission</span> </div> </div> </div> </section> <!-- ── EMPTY STATE (shown if no Firestore events) ── --> <section class="section empty-state-section" id="no-events-section" style="display:none"> <div class="container" style="text-align:center; padding: 56px 0;"> <p style="font-size:17px; color:var(--muted);">No upcoming events scheduled yet — check back soon!</p> <a href="/propose" class="btn btn-gold" style="margin-top:20px;">Propose an Event →</a> </div> </section> <!-- ── OTHER PROGRAMS ── --> <section class="section other-section"> <div class="container"> <h2 class="section-title reveal">Year-Round Programs</h2> <div class="other-grid"> <div class="other-card reveal"> <span class="other-icon">🎤</span> <h3>Open Mic Night</h3> <p>8–10 events per year at the Magna Library. Music, comedy, and poetry — open to all performers.</p> <a href="/programs#open-mic" class="other-link">Learn more →</a> </div> <div class="other-card reveal"> <span class="other-icon">✦</span> <h3>Group Art Night</h3> <p>Artist-guided sessions at the Magna Library. Come create with your community.</p> <a href="/programs#art-night" class="other-link">Learn more →</a> </div> <div class="other-card reveal"> <span class="other-icon">📚</span> <h3>Arts Seminar</h3> <p>Annual deep-dive into a different art discipline — panels, education, and Q&amp;A.</p> <a href="/programs#seminar" class="other-link">Learn more →</a> </div> </div> </div> </section> <!-- ── CTA ── --> <section class="cta-banner"> <div class="container cta-inner reveal"> <div> <h2>Want to Perform or Present?</h2> <p>Have a band, a film, an idea for a class? Submit a program proposal and we'll review it at our next board meeting.</p> </div> <a href="/propose" class="btn btn-gold">Submit a Proposal →</a> </div> </section> </main> `, ' <script type="module">', `
    import { initializeApp }                                          from 'https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js';
    import { getFirestore, collection, getDocs, orderBy, query }      from 'https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js';

    function extractEmbedSrc(val) {
      if (!val) return null;
      if (val.trim().startsWith('http')) return val.trim();
      const m = val.match(/src=["']([^"']+)["']/);
      return m ? m[1] : null;
    }

    function truncate(text, max) {
      if (!text || text.length <= max) return { short: text || '', truncated: false };
      return { short: text.slice(0, max).trimEnd(), truncated: true };
    }

    function stripHtml(html) {
      const div = document.createElement('div');
      div.innerHTML = html;
      return div.textContent || div.innerText || '';
    }

    function mapsLink(address) {
      return 'https://maps.google.com/?q=' + encodeURIComponent(address);
    }

    try {
      const app = initializeApp(firebaseConfig);
      const db  = getFirestore(app);

      const q    = query(collection(db, 'events'), orderBy('eventDate', 'asc'));
      const snap = await getDocs(q);

      const now      = new Date();
      const upcoming = [];

      snap.forEach(doc => {
        const d       = doc.data();
        const dateObj = d.eventDate?.toDate ? d.eventDate.toDate() : new Date(d.eventDate);
        if (dateObj < now) return;

        if (d.eventType === 'arts_festival') {
          const festDate    = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          const festVenue   = d.venueName || d.venue || '';
          const festAddress = d.venueAddress || d.address || '';
          (d.bands || []).forEach(b => {
            if (!b.bandId) return;
            upcoming.push({
              id:           doc.id + '-slot' + b.slot,
              title:        'Magna Main Street Arts Festival',
              date:         festDate,
              time:         b.time || d.eventTime || '',
              venueName:    festVenue,
              venueAddress: festAddress,
              description:  b.bio || '',
              posterUrl:    b.photoUrl || null,
              bandName:     b.bandName || null,
              genre:        b.genre || null,
              musicLink:    b.musicLink || null,
              ticketUrl:    null,
              rsvpUrl:      null,
            });
          });
          return;
        }

        upcoming.push({
          id:           doc.id,
          title:        d.title,
          date:         dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          time:         d.eventTime || d.startTime || '',
          venueName:    d.venueName || d.venue || '',
          venueAddress: d.venueAddress || d.address || '',
          description:  d.description || d.bandBio || '',
          posterUrl:    d.posterUrl || d.photoUrl || null,
          bandName:     d.bandName || null,
          genre:        d.genre || d.bandGenre || null,
          musicLink:                   d.musicLink || d.bandMusicLink || null,
          ticketUrl:                   d.ticketUrl || null,
          rsvpUrl:                     d.rsvpUrl || null,
          movieTitle:                  d.movieTitle || null,
          moviePreviewEmbed:           d.moviePreviewEmbed || null,
          eventType:                   d.eventType || null,
          presenterArtsArea:           d.presenterArtsArea || null,
          presenterProjectDescription: d.presenterProjectDescription || null,
        });
      });

      const noEventsSection = document.getElementById('no-events-section');
      if (upcoming.length === 0) {
        noEventsSection.style.display = 'block';
      }

      if (upcoming.length > 0) {
        const section = document.getElementById('live-events-section');
        const grid    = document.getElementById('live-events-grid');

        grid.innerHTML = upcoming.map(e => {
          const bio      = truncate(e.description, 150);
          const fullAddr = [e.venueName, e.venueAddress].filter(Boolean).join(', ');
          const isArtNight         = e.eventType === 'group_art_night';
          const artNightBioHtml    = isArtNight ? (e.presenterArtsArea || e.presenterProjectDescription || '') : '';
          const artNightNeedsTrunc = isArtNight && artNightBioHtml && stripHtml(artNightBioHtml).length > 300;

          return \`
          <article class="published-card">
            <div class="published-card-header">
              <div class="published-header-text">
                \${e.bandName ? \`<div class="published-band-name">\${e.bandName}</div>\` : ''}
                \${e.genre    ? \`<div class="published-genre">\${e.genre}</div>\` : ''}
              </div>
              \${e.musicLink ? \`<a href="\${e.musicLink}" target="_blank" rel="noopener" class="listen-btn">🎵 Listen</a>\` : ''}
            </div>
            <div class="published-poster">
              \${e.posterUrl
                ? \`<img src="\${e.posterUrl}" alt="\${e.bandName || e.title}" />\`
                : \`<div class="published-poster-placeholder">🎵</div>\`
              }
            </div>
            <div class="published-body">
              <div class="published-date">\${e.date}\${e.time ? ' · ' + e.time : ''}</div>
              <h3 class="published-title">\${e.title}</h3>
              \${fullAddr ? \`<div class="published-venue">📍 <a href="\${mapsLink(fullAddr)}" target="_blank" rel="noopener">\${fullAddr}</a></div>\` : ''}
              \${isArtNight && artNightBioHtml ? \`
                <div class="published-bio">
                  <div class="published-bio-label">About the Presenter</div>
                  <div class="presenter-html-bio\${artNightNeedsTrunc ? ' is-clamped' : ''}">
                    \${artNightBioHtml}
                  </div>
                  \${artNightNeedsTrunc ? \`<button class="bio-more-btn">more</button>\` : ''}
                </div>\` : (!isArtNight && e.description) ? \`
                <div class="published-bio">
                  <div class="published-bio-label">\${e.eventType === 'open_mic' ? 'Take The Stage' : 'About the Band'}</div>
                  <p class="published-desc">\${bio.short}\${bio.truncated ? \`<span class="bio-ellipsis">… <a href="#" class="bio-more-link" data-full="\${e.description.replace(/"/g,'&quot;')}">more</a></span>\` : ''}</p>
                </div>\` : ''}
              \${e.movieTitle ? \`
                <div class="published-movie">
                  <div class="published-movie-label">🎬 Tonight's Movie</div>
                  <div class="published-movie-title">\${e.movieTitle}</div>
                  \${e.moviePreviewEmbed ? \`
                  <div class="published-movie-embed">
                    <iframe
                      src="\${extractEmbedSrc(e.moviePreviewEmbed)}"
                      title="\${e.movieTitle} trailer"
                      frameborder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowfullscreen
                      loading="lazy"
                    ></iframe>
                  </div>\` : ''}
                </div>\` : ''}
              \${(e.ticketUrl || e.rsvpUrl) ? \`
              <div class="published-links">
                \${e.ticketUrl ? \`<a href="\${e.ticketUrl}" target="_blank" rel="noopener" class="btn btn-gold">Get Tickets</a>\` : ''}
                \${e.rsvpUrl   ? \`<a href="\${e.rsvpUrl}"   target="_blank" rel="noopener" class="btn btn-outline-navy">RSVP</a>\` : ''}
              </div>\` : ''}
            </div>
          </article>\`;
        }).join('');

        grid.querySelectorAll('.bio-more-link').forEach(link => {
          link.addEventListener('click', ev => {
            ev.preventDefault();
            const p = link.closest('p');
            p.innerHTML = link.dataset.full;
          });
        });

        grid.querySelectorAll('.bio-more-btn').forEach(btn => {
          btn.addEventListener('click', () => {
            btn.previousElementSibling.classList.remove('is-clamped');
            btn.remove();
          });
        });

        section.style.display = 'block';
        if (window.observer) {
          const newCards = grid.querySelectorAll('.reveal');
          newCards.forEach(card => window.observer.observe(card));
        }
      }
    } catch (err) {
      console.warn('Could not load live events:', err);
    }
  </script> `], [" ", " ", `<main> <!-- ── PAGE HERO ── --> <section class="page-hero"> <div class="container"> <h1>Free Events for Everyone</h1> <p class="hero-sub">
Every event is free and open to all. Bring a blanket, bring the family,
          and enjoy the best of Magna's arts community.
</p> </div> </section> <!-- ── FEATURED / PINNED EVENTS (static, date-gated) ── --> `, ` <!-- ── FIRESTORE PUBLISHED EVENTS — loaded client-side ── --> <section class="section published-events-section" id="live-events-section" style="display:none"> <div class="container"> <h2 class="section-title">Upcoming Events</h2> <div class="published-grid" id="live-events-grid"></div> </div> </section> <!-- ── SUMMER SERIES CALLOUT ── --> <section class="series-callout reveal"> <div class="container series-inner"> <div class="series-text"> <h2>Music &amp; Movies in the Park</h2> <p>Most Friday nights June through August. Live music starts at 8 PM, movie follows at dusk on our 35-ft inflatable screen.</p> <div class="series-details"> <span class="detail-pill">📍 Pleasant Green Park — 3250 S 8400 W, Magna</span> <span class="detail-pill">🗓 Most Fridays · June – August</span> <span class="detail-pill">🎟 Free Admission</span> </div> </div> </div> </section> <!-- ── EMPTY STATE (shown if no Firestore events) ── --> <section class="section empty-state-section" id="no-events-section" style="display:none"> <div class="container" style="text-align:center; padding: 56px 0;"> <p style="font-size:17px; color:var(--muted);">No upcoming events scheduled yet — check back soon!</p> <a href="/propose" class="btn btn-gold" style="margin-top:20px;">Propose an Event →</a> </div> </section> <!-- ── OTHER PROGRAMS ── --> <section class="section other-section"> <div class="container"> <h2 class="section-title reveal">Year-Round Programs</h2> <div class="other-grid"> <div class="other-card reveal"> <span class="other-icon">🎤</span> <h3>Open Mic Night</h3> <p>8–10 events per year at the Magna Library. Music, comedy, and poetry — open to all performers.</p> <a href="/programs#open-mic" class="other-link">Learn more →</a> </div> <div class="other-card reveal"> <span class="other-icon">✦</span> <h3>Group Art Night</h3> <p>Artist-guided sessions at the Magna Library. Come create with your community.</p> <a href="/programs#art-night" class="other-link">Learn more →</a> </div> <div class="other-card reveal"> <span class="other-icon">📚</span> <h3>Arts Seminar</h3> <p>Annual deep-dive into a different art discipline — panels, education, and Q&amp;A.</p> <a href="/programs#seminar" class="other-link">Learn more →</a> </div> </div> </div> </section> <!-- ── CTA ── --> <section class="cta-banner"> <div class="container cta-inner reveal"> <div> <h2>Want to Perform or Present?</h2> <p>Have a band, a film, an idea for a class? Submit a program proposal and we'll review it at our next board meeting.</p> </div> <a href="/propose" class="btn btn-gold">Submit a Proposal →</a> </div> </section> </main> `, ' <script type="module">', `
    import { initializeApp }                                          from 'https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js';
    import { getFirestore, collection, getDocs, orderBy, query }      from 'https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js';

    function extractEmbedSrc(val) {
      if (!val) return null;
      if (val.trim().startsWith('http')) return val.trim();
      const m = val.match(/src=["']([^"']+)["']/);
      return m ? m[1] : null;
    }

    function truncate(text, max) {
      if (!text || text.length <= max) return { short: text || '', truncated: false };
      return { short: text.slice(0, max).trimEnd(), truncated: true };
    }

    function stripHtml(html) {
      const div = document.createElement('div');
      div.innerHTML = html;
      return div.textContent || div.innerText || '';
    }

    function mapsLink(address) {
      return 'https://maps.google.com/?q=' + encodeURIComponent(address);
    }

    try {
      const app = initializeApp(firebaseConfig);
      const db  = getFirestore(app);

      const q    = query(collection(db, 'events'), orderBy('eventDate', 'asc'));
      const snap = await getDocs(q);

      const now      = new Date();
      const upcoming = [];

      snap.forEach(doc => {
        const d       = doc.data();
        const dateObj = d.eventDate?.toDate ? d.eventDate.toDate() : new Date(d.eventDate);
        if (dateObj < now) return;

        if (d.eventType === 'arts_festival') {
          const festDate    = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          const festVenue   = d.venueName || d.venue || '';
          const festAddress = d.venueAddress || d.address || '';
          (d.bands || []).forEach(b => {
            if (!b.bandId) return;
            upcoming.push({
              id:           doc.id + '-slot' + b.slot,
              title:        'Magna Main Street Arts Festival',
              date:         festDate,
              time:         b.time || d.eventTime || '',
              venueName:    festVenue,
              venueAddress: festAddress,
              description:  b.bio || '',
              posterUrl:    b.photoUrl || null,
              bandName:     b.bandName || null,
              genre:        b.genre || null,
              musicLink:    b.musicLink || null,
              ticketUrl:    null,
              rsvpUrl:      null,
            });
          });
          return;
        }

        upcoming.push({
          id:           doc.id,
          title:        d.title,
          date:         dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          time:         d.eventTime || d.startTime || '',
          venueName:    d.venueName || d.venue || '',
          venueAddress: d.venueAddress || d.address || '',
          description:  d.description || d.bandBio || '',
          posterUrl:    d.posterUrl || d.photoUrl || null,
          bandName:     d.bandName || null,
          genre:        d.genre || d.bandGenre || null,
          musicLink:                   d.musicLink || d.bandMusicLink || null,
          ticketUrl:                   d.ticketUrl || null,
          rsvpUrl:                     d.rsvpUrl || null,
          movieTitle:                  d.movieTitle || null,
          moviePreviewEmbed:           d.moviePreviewEmbed || null,
          eventType:                   d.eventType || null,
          presenterArtsArea:           d.presenterArtsArea || null,
          presenterProjectDescription: d.presenterProjectDescription || null,
        });
      });

      const noEventsSection = document.getElementById('no-events-section');
      if (upcoming.length === 0) {
        noEventsSection.style.display = 'block';
      }

      if (upcoming.length > 0) {
        const section = document.getElementById('live-events-section');
        const grid    = document.getElementById('live-events-grid');

        grid.innerHTML = upcoming.map(e => {
          const bio      = truncate(e.description, 150);
          const fullAddr = [e.venueName, e.venueAddress].filter(Boolean).join(', ');
          const isArtNight         = e.eventType === 'group_art_night';
          const artNightBioHtml    = isArtNight ? (e.presenterArtsArea || e.presenterProjectDescription || '') : '';
          const artNightNeedsTrunc = isArtNight && artNightBioHtml && stripHtml(artNightBioHtml).length > 300;

          return \\\`
          <article class="published-card">
            <div class="published-card-header">
              <div class="published-header-text">
                \\\${e.bandName ? \\\`<div class="published-band-name">\\\${e.bandName}</div>\\\` : ''}
                \\\${e.genre    ? \\\`<div class="published-genre">\\\${e.genre}</div>\\\` : ''}
              </div>
              \\\${e.musicLink ? \\\`<a href="\\\${e.musicLink}" target="_blank" rel="noopener" class="listen-btn">🎵 Listen</a>\\\` : ''}
            </div>
            <div class="published-poster">
              \\\${e.posterUrl
                ? \\\`<img src="\\\${e.posterUrl}" alt="\\\${e.bandName || e.title}" />\\\`
                : \\\`<div class="published-poster-placeholder">🎵</div>\\\`
              }
            </div>
            <div class="published-body">
              <div class="published-date">\\\${e.date}\\\${e.time ? ' · ' + e.time : ''}</div>
              <h3 class="published-title">\\\${e.title}</h3>
              \\\${fullAddr ? \\\`<div class="published-venue">📍 <a href="\\\${mapsLink(fullAddr)}" target="_blank" rel="noopener">\\\${fullAddr}</a></div>\\\` : ''}
              \\\${isArtNight && artNightBioHtml ? \\\`
                <div class="published-bio">
                  <div class="published-bio-label">About the Presenter</div>
                  <div class="presenter-html-bio\\\${artNightNeedsTrunc ? ' is-clamped' : ''}">
                    \\\${artNightBioHtml}
                  </div>
                  \\\${artNightNeedsTrunc ? \\\`<button class="bio-more-btn">more</button>\\\` : ''}
                </div>\\\` : (!isArtNight && e.description) ? \\\`
                <div class="published-bio">
                  <div class="published-bio-label">\\\${e.eventType === 'open_mic' ? 'Take The Stage' : 'About the Band'}</div>
                  <p class="published-desc">\\\${bio.short}\\\${bio.truncated ? \\\`<span class="bio-ellipsis">… <a href="#" class="bio-more-link" data-full="\\\${e.description.replace(/"/g,'&quot;')}">more</a></span>\\\` : ''}</p>
                </div>\\\` : ''}
              \\\${e.movieTitle ? \\\`
                <div class="published-movie">
                  <div class="published-movie-label">🎬 Tonight's Movie</div>
                  <div class="published-movie-title">\\\${e.movieTitle}</div>
                  \\\${e.moviePreviewEmbed ? \\\`
                  <div class="published-movie-embed">
                    <iframe
                      src="\\\${extractEmbedSrc(e.moviePreviewEmbed)}"
                      title="\\\${e.movieTitle} trailer"
                      frameborder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowfullscreen
                      loading="lazy"
                    ></iframe>
                  </div>\\\` : ''}
                </div>\\\` : ''}
              \\\${(e.ticketUrl || e.rsvpUrl) ? \\\`
              <div class="published-links">
                \\\${e.ticketUrl ? \\\`<a href="\\\${e.ticketUrl}" target="_blank" rel="noopener" class="btn btn-gold">Get Tickets</a>\\\` : ''}
                \\\${e.rsvpUrl   ? \\\`<a href="\\\${e.rsvpUrl}"   target="_blank" rel="noopener" class="btn btn-outline-navy">RSVP</a>\\\` : ''}
              </div>\\\` : ''}
            </div>
          </article>\\\`;
        }).join('');

        grid.querySelectorAll('.bio-more-link').forEach(link => {
          link.addEventListener('click', ev => {
            ev.preventDefault();
            const p = link.closest('p');
            p.innerHTML = link.dataset.full;
          });
        });

        grid.querySelectorAll('.bio-more-btn').forEach(btn => {
          btn.addEventListener('click', () => {
            btn.previousElementSibling.classList.remove('is-clamped');
            btn.remove();
          });
        });

        section.style.display = 'block';
        if (window.observer) {
          const newCards = grid.querySelectorAll('.reveal');
          newCards.forEach(card => window.observer.observe(card));
        }
      }
    } catch (err) {
      console.warn('Could not load live events:', err);
    }
  </script> `])), renderComponent($$result2, "Header", $$Header, {}), maybeRenderHead(), hasFeatured && renderTemplate`<section class="section featured-section"> <div class="container"> <div class="featured-section-header"> <span class="featured-section-label">📌 Featured</span> </div> <div class="featured-grid"> ${featuredEvents.map((e) => renderTemplate`<article${addAttribute(`featured-card ${e.accentColor}`, "class")}> <div class="featured-card-aside"> ${e.logoSrc && renderTemplate`<img${addAttribute(e.logoSrc, "src")} alt="" class="featured-card-logo" aria-hidden="true">`} <div class="featured-card-icon" aria-hidden="true">${e.icon}</div> </div> <div class="featured-card-body"> <span class="featured-badge">${e.badge}</span> <h2 class="featured-title">${e.title}</h2> <p class="featured-desc">${e.description}</p> <ul class="featured-details"> ${e.details.map((d) => renderTemplate`<li class="featured-detail-row"> <span class="featured-detail-icon" aria-hidden="true">${d.icon}</span> <span class="featured-detail-label">${d.label}</span> <span class="featured-detail-value">${d.value}</span> </li>`)} </ul> <a${addAttribute(e.href, "href")} class="btn btn-gold featured-cta"${spreadAttributes(e.ctaExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}> ${e.ctaText} </a> </div> </article>`)} </div> </div> </section>`, renderComponent($$result2, "Footer", $$Footer, {}), defineScriptVars({ firebaseConfig })) })}`;
}, "/Users/wfurgason/Documents/Arts Council/magnaarts.org/src/pages/events/index.astro", void 0);
const $$file = "/Users/wfurgason/Documents/Arts Council/magnaarts.org/src/pages/events/index.astro";
const $$url = "/events";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
