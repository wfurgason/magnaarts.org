import { c as createComponent } from './astro-component_CdpYp1nz.mjs';
import 'piccolore';
import { L as renderTemplate, x as maybeRenderHead } from './sequence_B8w407xz.mjs';
import { r as renderComponent } from './entrypoint_Diq9N73R.mjs';
import { $ as $$BaseLayout, a as $$Header, b as $$Footer } from './global_Hoz3rGEv.mjs';
import { getApps, initializeApp, cert } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';

const $$Volunteer = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Volunteer;
  let submitted = false;
  let errorMsg = "";
  if (Astro2.request.method === "POST") {
    try {
      const form = await Astro2.request.formData();
      const honeypot = form.get("full_name_hp")?.toString() || "";
      const fullName = form.get("fullName")?.toString().trim() || "";
      const email = form.get("email")?.toString().trim() || "";
      const phone = form.get("phone")?.toString().trim() || "";
      const canLift = form.get("canLift")?.toString() || "";
      const interests = form.getAll("interests").map((v) => v.toString());
      if (honeypot) {
        submitted = true;
      } else if (!fullName || !email) {
        errorMsg = "Please provide your name and email.";
      } else {
        if (!getApps().length) {
          initializeApp({
            credential: cert({
              projectId: "magnaarts",
              clientEmail: "firebase-adminsdk-fbsvc@magnaarts.iam.gserviceaccount.com",
              privateKey: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDvZx716qmR3jqm\n4bwWQrlxWgZ1UFiOi13APDW4kKy1YvvrroR9dRQpBd0XCUFJTmHZvzyIaRCLNMus\nHcStEl9E7T67c/eGYpzY2gEup1aHD80/4L4R2rbHyQGeR0iEiaBYZpv6zoYeF8RD\nbFHqL2V5+E79AqCl+eiZOHWxHca13Tc7VmeCNGXDcyNHa5sA7pYr0Uj1hlf1P7y5\npxIlVz0NsnqhFj1RZ3OrUXbSH/3DDhi9couZyqIU/UvW9iAH2MI2suCfOZYWnWk+\nHCv81yTTFsNzxWc+gWD+INssmTrosHy01+gl8t4mxpQqkLbMw0Jr9snVEy1amARg\nRHEKYufJAgMBAAECggEATYgnijv3s8J1W0OC/vCYDyI5MjgVngB7mbzGJyJPlKTc\ncm0AAoNuxoRcIFBCgQOuA+9/oqvoDDVKetDfN6/aA8ATz3CUqsR4CHC97kaKas5O\nyg+2bqDXDifGauSqEyZhNA/zFwxYehl3WeCUPNQhuJkWt7Dopygi0LBsyTIb/xxn\noxo+CoaP066vLKZktyc5RFpEbTZYx4KPrq/99rKsJKifgI8T721OwUCWs/FpAMb7\nXc6g+eCnscVmXX7+Wi6jPpiCxVNlVH26qqQdMOe44IjdxheEzzl6PPNcvXN+UmcN\nZ+yuIVlLx/XRoGS9/XByczwKdi6B9Mu9bnguywyHKwKBgQD4chw3p/6NSDhI9zlQ\n1CptWepjaTICmBDM0WMfyJYCn+l2OjfQTECsx6pBdD7J3XPqi9x2rBelQI3LCcfZ\nxrYcGbj+oJmJIyfswwHrVR9UfLuAQvoaJHTDAJH/RDt4RWp67ONTHNMJzhM+ZfZr\nrJciYzu4sTJmL+fcN/qaUKk5BwKBgQD2rp76NiXrj0zWmCL6sFWM1U8UsN9g/8M+\nUPm69JPkDul6lzFCLXCp5g4neLDtVawT+XbI4WaegOVwbFWaVtu4z9C+FVjcjjOf\nUnnWETDurM352dhVuQp7kuDsYs/mvTzIPedyTdoR7fkMtW5Oc9T4RvAtc7CHu0Ll\nDO52pYS0rwKBgQCZXJ8sgAgzIDyWVf3MdluGSvXTzdDwJvxf4nUE3qYzEpFjyMZB\nT4Cw50OiyeYkaA4w34sEunCSMsoUZoI2XWJ28C3xCCQeslPn4+ygX1hKqAB6SV3n\nm090PDrjTzRCpt726Jne6TEgoVPhtcEqcEyPDqCD/uX0jGfc2bVZYqdDKwKBgG/h\nq0EYpgI8sED0J4lDyMljRcbAoc/AsLDm0R02KI1bJhHv2OuG6H5mVS0Z1EUQgkdc\n8b8SXBSvqWBgAkNJ+cXMm4Ra8j62UDuGkLPCgEsAHTugzjmy/0okx9buyhSA57x6\nNyrknG9dW4OkFi+G4aTpp601t28YQ7LXNqChWZsJAoGAJPkeAd1Eoh46WLcMGQVy\nlAFhXbj/4RFJRtw4ii/LSA0Ef8RyzIjrOq2VsaP3l/C/XH9YWUqGmPjlwPMHCEmx\n/kdSsDfNfah8NuIHKyhWv+WyAjlZgFQnWcen6ZhwG9i+JTX4tscCxP3obI4lfY+U\n0eaeMVra/ySsaB4k4KRTIxU=\n-----END PRIVATE KEY-----\n"?.replace(/\\n/g, "\n")
            })
          });
        }
        const db = getFirestore();
        await db.collection("volunteer_signups").add({
          fullName,
          email,
          phone,
          canLift,
          interests,
          status: "new",
          submittedAt: FieldValue.serverTimestamp()
        });
        submitted = true;
      }
    } catch (err) {
      console.error("Volunteer form error:", err);
      errorMsg = "Something went wrong. Please try again.";
    }
  }
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "Volunteer Sign-Up — Magna Arts Council", "description": "Sign up to volunteer at Magna Arts Council events. Help with setup, greeting, sound, photography, and more.", "data-astro-cid-74exv7u4": true }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "Header", $$Header, { "data-astro-cid-74exv7u4": true })} ${maybeRenderHead()}<main data-astro-cid-74exv7u4> <!-- ── PAGE HERO ── --> <section class="page-hero" data-astro-cid-74exv7u4> <div class="container" data-astro-cid-74exv7u4> <div class="hero-badge" data-astro-cid-74exv7u4>Volunteer</div> <h1 data-astro-cid-74exv7u4>Help Make It Happen</h1> <p class="hero-sub" data-astro-cid-74exv7u4>
Our events run on community energy. Sign up below and we'll reach out
          when opportunities match your interests.
</p> </div> </section> <section class="section form-section" data-astro-cid-74exv7u4> <div class="container form-wrap" data-astro-cid-74exv7u4> ${submitted ? renderTemplate`<div class="success-card" data-astro-cid-74exv7u4> <div class="success-icon" data-astro-cid-74exv7u4>🙌</div> <h2 data-astro-cid-74exv7u4>Thanks for signing up!</h2> <p data-astro-cid-74exv7u4>We'll be in touch when there's an opportunity that fits. We appreciate your willingness to help.</p> <a href="/" class="btn btn-gold" style="margin-top:16px" data-astro-cid-74exv7u4>Back to Home →</a> </div>` : renderTemplate`<form method="POST" class="volunteer-form" data-astro-cid-74exv7u4> <!-- honeypot: bots fill this, humans don't --> <div class="hp-field" aria-hidden="true" data-astro-cid-74exv7u4> <label for="full_name_hp" data-astro-cid-74exv7u4>Leave this blank</label> <input type="text" id="full_name_hp" name="full_name_hp" tabindex="-1" autocomplete="off" data-astro-cid-74exv7u4> </div> ${errorMsg && renderTemplate`<div class="form-error" data-astro-cid-74exv7u4>${errorMsg}</div>`} <div class="form-field" data-astro-cid-74exv7u4> <label for="fullName" data-astro-cid-74exv7u4>Full Name <span class="req" data-astro-cid-74exv7u4>*</span></label> <input type="text" id="fullName" name="fullName" required placeholder="Your full name" data-astro-cid-74exv7u4> </div> <div class="form-row" data-astro-cid-74exv7u4> <div class="form-field" data-astro-cid-74exv7u4> <label for="email" data-astro-cid-74exv7u4>Email Address <span class="req" data-astro-cid-74exv7u4>*</span></label> <input type="email" id="email" name="email" required placeholder="you@example.com" data-astro-cid-74exv7u4> </div> <div class="form-field" data-astro-cid-74exv7u4> <label for="phone" data-astro-cid-74exv7u4>Phone Number</label> <input type="tel" id="phone" name="phone" placeholder="(801) 555-0100" data-astro-cid-74exv7u4> </div> </div> <div class="form-field" data-astro-cid-74exv7u4> <label data-astro-cid-74exv7u4>Are you able to lift at least 40 lbs?</label> <div class="radio-group" data-astro-cid-74exv7u4> <label class="radio-option" data-astro-cid-74exv7u4> <input type="radio" name="canLift" value="yes" data-astro-cid-74exv7u4> Yes
</label> <label class="radio-option" data-astro-cid-74exv7u4> <input type="radio" name="canLift" value="no" data-astro-cid-74exv7u4> No
</label> </div> </div> <div class="form-field" data-astro-cid-74exv7u4> <label data-astro-cid-74exv7u4>I am most interested in: <span class="field-hint" data-astro-cid-74exv7u4>(check all that apply)</span></label> <div class="checkbox-group" data-astro-cid-74exv7u4> <label class="checkbox-option" data-astro-cid-74exv7u4> <input type="checkbox" name="interests" value="Music and Movies in the Park" data-astro-cid-74exv7u4>
Music &amp; Movies in the Park
</label> <label class="checkbox-option" data-astro-cid-74exv7u4> <input type="checkbox" name="interests" value="Magna Main Street Arts Festival" data-astro-cid-74exv7u4>
Magna Main Street Arts Festival
</label> <label class="checkbox-option" data-astro-cid-74exv7u4> <input type="checkbox" name="interests" value="Open Mic Night" data-astro-cid-74exv7u4>
Open Mic Night at the Library
</label> <label class="checkbox-option" data-astro-cid-74exv7u4> <input type="checkbox" name="interests" value="Group Art Night" data-astro-cid-74exv7u4>
Group Art Night
</label> <label class="checkbox-option" data-astro-cid-74exv7u4> <input type="checkbox" name="interests" value="Arts Council Board" data-astro-cid-74exv7u4>
Arts Council Board Positions
</label> </div> </div> <div class="form-actions" data-astro-cid-74exv7u4> <button type="submit" class="btn btn-gold" data-astro-cid-74exv7u4>Submit →</button> </div> </form>`} </div> </section> </main> ${renderComponent($$result2, "Footer", $$Footer, { "data-astro-cid-74exv7u4": true })} ` })}`;
}, "/Users/wfurgason/Documents/Arts Council/magnaarts.org/src/pages/volunteer.astro", void 0);
const $$file = "/Users/wfurgason/Documents/Arts Council/magnaarts.org/src/pages/volunteer.astro";
const $$url = "/volunteer";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Volunteer,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
