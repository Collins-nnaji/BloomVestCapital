/**
 * Investment-planning math shared by the Fund Allocation planner and the
 * Profile goal projections. All returns are nominal annual rates; growth is
 * compounded monthly with optional monthly contributions.
 */

export const RETURN_PRESETS = {
  conservative: 0.05,
  moderate: 0.08,
  aggressive: 0.11,
};

/** Map a profile risk level (or allocation riskLevel) to an assumed annual return. */
export function presetReturnFor(risk) {
  const key = String(risk || '').toLowerCase();
  return RETURN_PRESETS[key] ?? RETURN_PRESETS.moderate;
}

function monthlyRate(annualReturn) {
  return Math.pow(1 + annualReturn, 1 / 12) - 1;
}

/** Projected future value of a lump sum + recurring monthly contributions. */
export function projectValue({ principal = 0, monthly = 0, annualReturn = 0.08, years = 0 }) {
  const P = Math.max(0, Number(principal) || 0);
  const C = Math.max(0, Number(monthly) || 0);
  const yrs = Math.max(0, Number(years) || 0);
  const months = Math.round(yrs * 12);
  if (months === 0) return P;
  const r = monthlyRate(annualReturn);
  const lump = P * Math.pow(1 + r, months);
  const contrib = r === 0 ? C * months : C * ((Math.pow(1 + r, months) - 1) / r);
  return lump + contrib;
}

/** Monthly contribution needed to reach `target` by `years`, given a starting `principal`. */
export function monthlyNeeded({ target = 0, principal = 0, annualReturn = 0.08, years = 0 }) {
  const T = Math.max(0, Number(target) || 0);
  const P = Math.max(0, Number(principal) || 0);
  const yrs = Math.max(0, Number(years) || 0);
  const months = Math.round(yrs * 12);
  if (months === 0) return Math.max(0, T - P);
  const r = monthlyRate(annualReturn);
  const futureLump = P * Math.pow(1 + r, months);
  const remaining = T - futureLump;
  if (remaining <= 0) return 0;
  const factor = r === 0 ? months : (Math.pow(1 + r, months) - 1) / r;
  return remaining / factor;
}

/** Fractional years between now and an ISO date string (null if invalid). */
export function yearsUntil(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return null;
  return (d.getTime() - Date.now()) / (365.25 * 24 * 3600 * 1000);
}

/** Series of {year, value} points for charting a projection. */
export function projectionSeries({ principal = 0, monthly = 0, annualReturn = 0.08, years = 0, points }) {
  const yrs = Math.max(0, Number(years) || 0);
  const n = points || Math.min(Math.max(Math.ceil(yrs), 2), 24);
  const out = [];
  for (let i = 0; i <= n; i += 1) {
    const y = (yrs * i) / n;
    out.push({
      year: Math.round(y * 10) / 10,
      value: Math.round(projectValue({ principal, monthly, annualReturn, years: y })),
    });
  }
  return out;
}

/**
 * On-track assessment: compares the monthly contribution a goal needs with what
 * the user can actually save each month.
 * Returns { status: 'on-track' | 'behind' | 'reached', needed, projected }.
 */
export function goalStatus({ target, current = 0, years, annualReturn, monthlyCapacity = null }) {
  const needed = monthlyNeeded({ target, principal: current, annualReturn, years });
  const projected = projectValue({
    principal: current,
    monthly: monthlyCapacity != null ? monthlyCapacity : needed,
    annualReturn,
    years,
  });
  if (needed <= 0) return { status: 'reached', needed: 0, projected };
  if (monthlyCapacity != null) {
    return { status: monthlyCapacity >= needed ? 'on-track' : 'behind', needed, projected };
  }
  return { status: 'on-track', needed, projected };
}
