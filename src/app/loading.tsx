export default function Loading() {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/50 backdrop-blur-sm">
            <div className="relative flex items-center justify-center">
                {/* Pulsing Ring */}
                <div className="absolute inset-0 rounded-xl bg-primary/20 animate-ping" />

                {/* Static Logo Container */}
                <div className="relative w-14 h-14 bg-primary rounded-xl flex items-center justify-center shadow-lg z-10">
                    <span className="text-2xl font-bold text-white font-heading">B</span>
                </div>
            </div>
        </div>
    )
}
