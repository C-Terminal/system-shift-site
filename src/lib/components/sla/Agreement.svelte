<script lang="ts">
    // ------- Editable props -------
    export let businessName = "SystemShift Technologies";
    export let legalStructure = "sole proprietorship";
    export let jurisdiction = "Ontario, Canada";
  
    export let effectiveDate = ""; // e.g., "Oct 7, 2025"
    export let clientName = "";
  
    // Support/Service details
    export let supportHours = "Mon–Fri, 9:00 AM – 6:00 PM (Eastern Time)";
    export let criticalSupport = "Weekends available for critical system failures";
    export let responseCritical = "Within 2 hours";
    export let responseStandard = "Within 24 hours";
    export let resolutionCritical = "Resolution or reinstall within 24 hours (subject to hardware availability)";
    export let resolutionStandard = "Typically within 1–3 business days";
    export let logRetention = "7 days";
    export let priceCAD = "50";
  
    // Contact channels (fill these in your page load or pass via props)
    export let contactPhone = "";   // e.g., "(555) 555-5555"
    export let contactEmail = "";   // e.g., "support@systemshift.ca"
    export let contactWebsite = ""; // e.g., "https://systemshift.ca/support"
  
    // Simple helper for printing
    const doPrint = () => window.print();
  </script>
  
  <section class="doc">
    <header class="doc__header">
      <h1>{businessName} – Service Level Agreement (SLA)</h1>
      <div class="meta">
        <div><strong>Effective Date:</strong> {effectiveDate || "____________________"}</div>
        <div><strong>Client Name:</strong> {clientName || "____________________"}</div>
        <div><strong>Service Provider:</strong> {businessName} ({legalStructure}), {jurisdiction}</div>
      </div>
      <div class="actions no-print">
        <button class="btn" on:click={doPrint} aria-label="Print or Save as PDF">🖨️ Print / Save as PDF</button>
      </div>
    </header>
  
    <article class="doc__body">
      <section>
        <h2>1. Purpose of This Agreement</h2>
        <p>
          This Service Level Agreement (“SLA”) outlines the services, response times, and mutual responsibilities between
          <strong>{businessName}</strong> (“Provider”) and the <strong>Client</strong>. The goal is to ensure clear expectations,
          consistent service, and reliable support for systems migrated to Fedora Linux.
        </p>
      </section>
  
      <section>
        <h2>2. Scope of Services</h2>
        <ul>
          <li><strong>Linux System Migration</strong> – Full migration of the Client’s Windows environment to Fedora Linux, including system setup, user account creation, and transfer of essential data and applications.</li>
          <li><strong>Remote Support</strong> – Ongoing remote technical support for configuration, performance, and usability issues related to the Fedora system.</li>
          <li><strong>Proactive Monitoring (Limited)</strong> – Limited monitoring of system performance indicators. If a clear performance issue or bottleneck is detected, the Provider may diagnose and advise on solutions.</li>
          <li><strong>Automatic Security Updates &amp; Patching</strong> – Security updates are configured to install automatically using post-installation scripts.</li>
          <li><strong>On-Site Assistance (Critical Only)</strong> – Free on-site support if a critical system failure requires a full OS reinstall or recovery of essential system functions.</li>
        </ul>
        <p class="note">
          <strong>Note:</strong> Client-managed backups (e.g., Snapper snapshots or other local tools) are outside the scope of this SLA. No remote/cloud backup services are included.
        </p>
      </section>
  
      <section>
        <h2>3. Service Availability &amp; Support Hours</h2>
        <div class="kv">
          <div><strong>Regular Support:</strong> {supportHours}</div>
          <div><strong>Critical Support:</strong> {criticalSupport}</div>
        </div>
        <div class="kv">
          <div><strong>Support Channels:</strong></div>
          <ul>
            <li>Phone: {contactPhone || "_______________"}</li>
            <li>Email: {contactEmail || "_______________"}</li>
            <li>Website: {contactWebsite || "_______________"}</li>
          </ul>
        </div>
      </section>
  
      <section>
        <h2>4. Response &amp; Resolution Targets</h2>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Issue Type</th>
                <th>Target Initial Response</th>
                <th>Target Resolution Goal</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Critical</strong> (System Failure / OS Corruption)</td>
                <td>{responseCritical}</td>
                <td>{resolutionCritical}</td>
              </tr>
              <tr>
                <td><strong>Standard Request</strong> (Configuration, updates, general questions)</td>
                <td>{responseStandard}</td>
                <td>{resolutionStandard}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
  
      <section>
        <h2>5. Logging &amp; Retention</h2>
        <p>
          System logs from migrated systems may be collected for diagnostic purposes. Logs are retained for
          <strong> {logRetention}</strong> and used exclusively to troubleshoot and improve service reliability.
        </p>
      </section>
  
      <section>
        <h2>6. Client Responsibilities</h2>
        <ul>
          <li>The Client is solely responsible for maintaining <strong>local backups</strong> of important data (e.g., via Snapper snapshots or personal backup methods).</li>
          <li>The Client will avoid modifying critical system files, disabling automatic updates, or installing unverified third-party software without consultation.</li>
          <li>The Client will provide timely access (remote or in-person) if troubleshooting requires it.</li>
        </ul>
        <p class="note">
          <strong>Exclusions:</strong> The Provider is not responsible for data loss, corruption, or downtime resulting from Client modifications, hardware failure, or failure to maintain local backups.
        </p>
      </section>
  
      <section>
        <h2>7. Fees &amp; Payment</h2>
        <p>
          <strong>Service Tier:</strong> Premium (one-time payment)<br>
          <strong>Price:</strong> ${priceCAD} CAD per system migrated<br>
          Includes migration, remote support, limited proactive monitoring, and free on-site visit for critical failures.
          Additional work or future upgrades not covered under this SLA may be quoted separately.
        </p>
      </section>
  
      <section>
        <h2>8. Liability &amp; Limitations</h2>
        <ul>
          <li>Liability for any claim is limited to the total amount paid by the Client in the previous <strong>three (3) months</strong>.</li>
          <li>The Provider is not liable for indirect, incidental, or consequential damages including data loss, downtime, or loss of business income.</li>
          <li>The Client agrees that reliable backups are their own responsibility.</li>
        </ul>
      </section>
  
      <section>
        <h2>9. Term &amp; Termination</h2>
        <p>
          This agreement takes effect on the date of migration completion and remains valid for ongoing support until either party provides written notice to terminate.
          The Client may terminate at any time; refunds are not provided for completed services.
        </p>
      </section>
  
      <section>
        <h2>10. Governing Law</h2>
        <p>
          This agreement is governed by the laws of <strong>{jurisdiction}</strong>. Any disputes will be handled in that jurisdiction.
        </p>
      </section>
  
      <section>
        <h2>11. Agreement Acknowledgement</h2>
        <p>
          By signing below, both parties acknowledge that they have read, understood, and agreed to the terms of this Service Level Agreement.
        </p>
  
        <div class="signatures">
          <div class="sig">
            <div class="label">Client Signature</div>
            <div class="line"></div>
            <div class="label">Date</div>
            <div class="line short"></div>
          </div>
          <div class="sig">
            <div class="label">{businessName}</div>
            <div class="line"></div>
            <div class="label">Date</div>
            <div class="line short"></div>
          </div>
        </div>
      </section>
  
      <section class="appendix">
        <h3>Appendix A – Summary of Key Commitments</h3>
        <div class="table-wrap">
          <table>
            <tbody>
              <tr><td><strong>Response Times</strong></td><td>2 hours (critical), 24 hours (standard)</td></tr>
              <tr><td><strong>Support Hours</strong></td><td>{supportHours}; weekends for critical incidents</td></tr>
              <tr><td><strong>Retention</strong></td><td>Logs kept {logRetention}</td></tr>
              <tr><td><strong>Backup Responsibility</strong></td><td>Client-managed (local only)</td></tr>
              <tr><td><strong>Included Visits</strong></td><td>On-site free for critical failures</td></tr>
              <tr><td><strong>Updates</strong></td><td>Automatic via post-install script</td></tr>
              <tr><td><strong>Price</strong></td><td>${priceCAD} (one-time)</td></tr>
            </tbody>
          </table>
        </div>
      </section>
    </article>
  </section>
  
  <style>
    :root {
      --bg: #ffffff;
      --fg: #0f172a;         /* slate-900 */
      --muted: #475569;      /* slate-600 */
      --border: #e2e8f0;     /* slate-200 */
      --accent: #0ea5e9;     /* sky-500 */
      --soft: #f8fafc;       /* slate-50 */
    }
  
    .doc {
      max-width: 900px;
      margin: 2rem auto;
      padding: 2rem;
      background: var(--bg);
      color: var(--fg);
      border: 1px solid var(--border);
      border-radius: 16px;
      box-shadow: 0 6px 24px rgba(15, 23, 42, 0.05);
    }
  
    .doc__header h1 {
      font-size: clamp(1.4rem, 2.4vw, 2rem);
      line-height: 1.2;
      margin: 0 0 0.25rem;
    }
  
    .meta {
      display: grid;
      gap: 0.25rem;
      color: var(--muted);
      font-size: 0.975rem;
      margin-top: 0.25rem;
    }
  
    .actions {
      margin-top: 1rem;
    }
  
    .btn {
      background: var(--accent);
      color: white;
      border: none;
      padding: 0.65rem 1rem;
      border-radius: 10px;
      cursor: pointer;
      font-weight: 600;
    }
    .btn:hover { filter: brightness(0.95); }
  
    .doc__body {
      margin-top: 1.5rem;
    }
  
    h2 {
      margin: 1.25rem 0 0.5rem;
      font-size: 1.15rem;
      border-left: 4px solid var(--accent);
      padding-left: 0.5rem;
    }
  
    h3 {
      margin: 1rem 0 0.5rem;
      font-size: 1.05rem;
      color: var(--muted);
    }
  
    p, li {
      line-height: 1.65;
    }
  
    ul {
      margin: 0.25rem 0 0.75rem;
      padding-left: 1.1rem;
    }
  
    .note {
      background: var(--soft);
      border: 1px solid var(--border);
      border-left: 4px solid var(--accent);
      padding: 0.75rem 0.9rem;
      border-radius: 10px;
      margin-top: 0.5rem;
    }
  
    .kv { margin: 0.25rem 0 0.5rem; }
  
    .table-wrap {
      overflow-x: auto;
      border: 1px solid var(--border);
      border-radius: 10px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      background: #fff;
    }
    thead th {
      text-align: left;
      background: var(--soft);
      border-bottom: 1px solid var(--border);
      font-weight: 700;
      padding: 0.6rem 0.75rem;
    }
    tbody td {
      border-top: 1px solid var(--border);
      padding: 0.6rem 0.75rem;
      vertical-align: top;
    }
    tbody tr:nth-child(even) td {
      background: #fcfdff;
    }
  
    .signatures {
      display: grid;
      grid-template-columns: 1fr;
      gap: 1rem;
      margin: 1rem 0 0.5rem;
    }
    @media (min-width: 700px) {
      .signatures { grid-template-columns: 1fr 1fr; }
    }
    .sig .label {
      font-size: 0.95rem;
      color: var(--muted);
      margin-bottom: 0.25rem;
    }
    .sig .line {
      border-bottom: 1px solid var(--fg);
      height: 1.8rem;
      margin-bottom: 0.5rem;
    }
    .sig .line.short {
      width: 60%;
    }
  
    .appendix {
      margin-top: 1rem;
    }
  
    /* Print styles */
    @media print {
      .no-print, .actions { display: none !important; }
      .doc {
        border: none;
        box-shadow: none;
        padding: 0;
        margin: 0;
        max-width: 100%;
      }
      body {
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
    }
  </style>
  