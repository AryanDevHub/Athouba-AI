import os
import subprocess
import shutil

try:
    import imageio_ffmpeg
    ffmpeg_exe = imageio_ffmpeg.get_ffmpeg_exe()
except Exception as e:
    ffmpeg_exe = "ffmpeg"

SOURCE_AVI = r"F:\football_analysis (2)\football_analysis\football_analysis\output_videos\output_video.avi"
DEST_DIR_BACKEND = os.path.abspath("uploads/processed")
DEST_DIR_FRONTEND = os.path.abspath("frontend/public/videos")

os.makedirs(DEST_DIR_BACKEND, exist_ok=True)
os.makedirs(DEST_DIR_FRONTEND, exist_ok=True)

DEST_MP4_BACKEND = os.path.join(DEST_DIR_BACKEND, "football_match_analysis.mp4")
DEST_MP4_FRONTEND = os.path.join(DEST_DIR_FRONTEND, "football_match_analysis.mp4")

def transcode():
    if not os.path.exists(SOURCE_AVI):
        print(f"ERROR: Source AVI not found at: {SOURCE_AVI}")
        return False

    print(f"Found source video: {SOURCE_AVI} ({os.path.getsize(SOURCE_AVI)} bytes)")
    print(f"Targeting: {DEST_MP4_BACKEND}")

    cmd = [
        ffmpeg_exe,
        "-y",
        "-i", SOURCE_AVI,
        "-c:v", "libx264",
        "-pix_fmt", "yuv420p",
        "-preset", "fast",
        "-crf", "23",
        "-movflags", "+faststart",
        DEST_MP4_BACKEND
    ]

    print("Running FFmpeg command:", " ".join(cmd))
    res = subprocess.run(cmd, capture_output=True, text=True)

    if res.returncode != 0:
        print("FFmpeg error:", res.stderr[-1000:])
        return False

    file_size = os.path.getsize(DEST_MP4_BACKEND)
    print(f"Transcoding successful! Output size: {file_size} bytes ({round(file_size/(1024*1024), 2)} MB)")

    # Also copy to frontend public directory for direct client access
    shutil.copy(DEST_MP4_BACKEND, DEST_MP4_FRONTEND)
    print(f"Copied to frontend public: {DEST_MP4_FRONTEND}")
    return True

if __name__ == "__main__":
    transcode()
