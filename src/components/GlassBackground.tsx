/**
 * Fixed-position animated background with a mesh gradient and
 * softly floating colored orbs. Provides the depth glass panels
 * need to look translucent. Rendered once at the app root.
 */
export const GlassBackground = () => {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {/* Base mesh gradient (static) */}
      <div
        className="absolute inset-0 opacity-90 dark:opacity-70"
        style={{
          backgroundImage: `
            radial-gradient(at 12% 18%, rgba(45, 164, 78, 0.18) 0px, transparent 55%),
            radial-gradient(at 88% 22%, rgba(59, 130, 246, 0.14) 0px, transparent 50%),
            radial-gradient(at 78% 82%, rgba(139, 92, 246, 0.14) 0px, transparent 55%),
            radial-gradient(at 22% 78%, rgba(16, 185, 129, 0.12) 0px, transparent 55%)
          `,
        }}
      />

      {/* Animated orbs */}
      <div
        className="orb-animate-a absolute -top-32 -left-24 w-[60vw] max-w-[720px] aspect-square rounded-full bg-emerald-400/30 dark:bg-emerald-500/20 blur-3xl"
      />
      <div
        className="orb-animate-b absolute top-1/3 -right-32 w-[55vw] max-w-[640px] aspect-square rounded-full bg-blue-400/25 dark:bg-sky-500/18 blur-3xl"
      />
      <div
        className="orb-animate-c absolute -bottom-40 left-1/4 w-[55vw] max-w-[640px] aspect-square rounded-full bg-violet-400/20 dark:bg-fuchsia-500/15 blur-3xl"
      />
    </div>
  );
};

export default GlassBackground;
