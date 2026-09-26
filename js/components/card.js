/**
 * Reusable Card Component Builder.
 */

export function buildCard({ title, subtitle, icon, badge, body, actionsHtml }) {
  return `
    <div class="card animate-fade-in">
      <div class="card-header">
        <div class="card-title">
          ${icon ? `<i data-lucide="${icon}"></i>` : ''}
          <span>${title}</span>
        </div>
        ${badge ? `<span class="badge badge-${badge.type}">${badge.label}</span>` : ''}
      </div>
      ${subtitle ? `<p style="font-size: var(--font-size-sm); color: var(--color-text-secondary); margin-bottom: var(--space-xs);">${subtitle}</p>` : ''}
      <div class="card-body">
        ${body}
      </div>
      ${actionsHtml ? `<div style="margin-top: var(--space-md); display: flex; gap: var(--space-xs); flex-wrap: wrap;">${actionsHtml}</div>` : ''}
    </div>
  `;
}
