<h1 className="text-2xl font-semibold">Billing</h1>

<div className="mt-6 rounded-3xl border border-white/10 bg-white/[0.04] p-6">
  <div className="text-sm text-white/60">Current Plan</div>
  <div className="mt-1 text-xl font-medium">{user.plan}</div>

  <div className="mt-6 text-sm text-white/60">Credits Remaining</div>
  <div className="mt-1 text-3xl font-semibold">
    {user.creditsBalance}
  </div>

  <button
    onClick={upgrade}
    className="mt-6 rounded-2xl bg-white text-black px-6 py-3"
  >
    Upgrade to Pro
  </button>
</div>