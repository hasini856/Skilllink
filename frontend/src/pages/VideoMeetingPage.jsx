import { JitsiMeeting } from "@jitsi/react-sdk";

function VideoMeetingPage() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-lg">
      <div className="mb-4">
        <p className="text-sm font-medium uppercase tracking-wide text-primary-600">
          Live Session
        </p>

        <h1 className="mt-1 text-2xl font-bold text-slate-900">
          SkillLink Meeting Room
        </h1>

        <p className="mt-2 text-slate-600">
          Connect with mentors and learners through live video sessions.
        </p>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200">
        <JitsiMeeting
          domain="meet.jit.si"
          roomName={`SkillLink-${Math.floor(Math.random() * 100000)}`}
          userInfo={{
            displayName: "SkillLink User",
          }}
          configOverwrite={{
            startWithAudioMuted: true,
            startWithVideoMuted: false,
            prejoinPageEnabled: false,
            disableModeratorIndicator: true,
          }}
          interfaceConfigOverwrite={{
            DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
          }}
          getIFrameRef={(node) => {
            node.style.height = "700px";
            node.style.width = "100%";
          }}
        />
      </div>
    </section>
  );
}

export default VideoMeetingPage;