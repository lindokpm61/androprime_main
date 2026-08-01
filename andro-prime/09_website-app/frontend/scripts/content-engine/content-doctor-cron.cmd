@echo off
REM ============================================================================
REM  content-doctor-cron.cmd - the ONE thing Windows Task Scheduler calls.
REM
REM  WHY THIS FILE EXISTS: THE WORKING-DIRECTORY TRAP.
REM  Every repo path in content-doctor.ts is resolved from process.cwd()
REM  (REPO_ROOT = ../../.. from the frontend directory). Run from anywhere else
REM  and the doctor still starts, still reaches the database, and still prints a
REM  verdict: one computed over ZERO repo files.
REM
REM  That trap is live, not theoretical. On 2026-08-01 the scanner at
REM  .claude/skills/content-status/scan.js was found exiting 0 having scanned
REM  zero assets, for exactly this reason: wrong cwd, clean-looking board.
REM
REM  Task Scheduler makes it worse. Its "Start in" field is optional and easy to
REM  leave blank, in which case the task runs from C:\Windows\System32. So the
REM  working directory is NOT taken from the environment here. It is derived from
REM  THIS SCRIPT'S OWN LOCATION (%~dp0), which is correct no matter who invokes
REM  it, from where, with or without "Start in" set.
REM
REM      %~dp0 = ...\09_website-app\frontend\scripts\content-engine\
REM      ..\.. = ...\09_website-app\frontend            <- the required cwd
REM
REM  Belt and braces: this wrapper verifies it landed somewhere sane, and the
REM  script itself re-checks the layout (repoLayoutProblems) and exits 1 rather
REM  than reporting on a repo it cannot see. Two independent guards, because the
REM  failure they prevent is silent by nature.
REM
REM  KEEP THIS FILE CRLF AND ASCII-ONLY. cmd.exe mis-parses LF-only batch files
REM  and mangles non-ASCII under a non-UTF8 codepage. Both were hit while writing
REM  it: the LF version failed with "'ontent-doctor-cron.cmd' is not recognized".
REM
REM  EXIT CODES are the doctor's own, propagated unchanged, so the Task Scheduler
REM  "Last Run Result" column is meaningful:
REM      0  every invariant holds
REM      2  ALARM: at least one invariant FAILs
REM      3  no failure, but something was not measured (3 with zero UNEXPECTED
REM         gaps is the documented, expected baseline, and not an alarm)
REM      1  the run itself failed (bad cwd, no credentials, crash)
REM
REM  Register it with the schtasks command in the handover notes; this file does
REM  not register itself.
REM ============================================================================

setlocal

REM --- Pin the working directory to frontend/, derived from this script's path.
pushd "%~dp0..\.."
if errorlevel 1 goto badcwd
if not exist "package.json" goto nopkg
if not exist "scripts\content-engine\content-doctor-cron.ts" goto noscript

echo [content-doctor-cron] %DATE% %TIME%  cwd=%CD%

REM --- Run it. --log writes the single agent_runs telemetry row; no findings
REM     file is ever written (12_operations/automation/scheduled-agents.md
REM     forbids a status store outside ClickUp). Extra args pass straight
REM     through, so `content-doctor-cron.cmd --dry-run` works for a hand check.
call npx tsx "scripts\content-engine\content-doctor-cron.ts" --log %*
set "DOCTOR_EXIT=%ERRORLEVEL%"

echo [content-doctor-cron] finished with exit %DOCTOR_EXIT%
popd
endlocal & exit /b %DOCTOR_EXIT%

:badcwd
echo [content-doctor-cron] FATAL: could not enter "%~dp0..\.." 1>&2
endlocal & exit /b 1

:nopkg
echo [content-doctor-cron] FATAL: no package.json in "%CD%". 1>&2
echo [content-doctor-cron] Expected the 09_website-app\frontend directory. 1>&2
echo [content-doctor-cron] Refusing to run: from the wrong directory this reports a clean board it never measured. 1>&2
popd
endlocal & exit /b 1

:noscript
echo [content-doctor-cron] FATAL: "%CD%" has a package.json but not the content-engine scripts. 1>&2
popd
endlocal & exit /b 1
