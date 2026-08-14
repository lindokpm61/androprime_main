@echo off
REM ============================================================================
REM  metricool-writeback-cron.cmd - the ONE thing Windows Task Scheduler calls.
REM
REM  WHY THIS FILE EXISTS: THE WORKING-DIRECTORY TRAP. Task Scheduler leaves
REM  "Start in" optional, and blank means the task runs from C:\Windows\System32.
REM  The cwd is therefore derived from THIS SCRIPT'S OWN LOCATION (%~dp0), which
REM  is correct no matter who invokes it or from where.
REM
REM      %~dp0 = ...\09_website-app\frontend\scripts\content-engine\
REM      ..\.. = ...\09_website-app\frontend            <- the required cwd
REM
REM  KEEP THIS FILE CRLF AND ASCII-ONLY. cmd.exe mis-parses LF-only batch files
REM  and mangles non-ASCII under a non-UTF8 codepage.
REM
REM  EXIT CODES are the job's own, propagated unchanged, so Task Scheduler's
REM  "Last Run Result" column is meaningful:
REM      0  nothing had published, or everything that had was recorded
REM      2  a post IS live but the write-back FAILED: the stores now disagree
REM      3  work owed: a post did not go out, or an id does not match its rendition
REM      1  the run itself failed (bad cwd, missing credentials, crash)
REM
REM  This job only READS Metricool and writes our own database. It never creates,
REM  edits or publishes a post, which is why it is safe on a timer where
REM  metricool-schedule deliberately is not.
REM
REM  Register it with the command in 12_operations/automation/scheduled-agents.md;
REM  this file does not register itself.
REM ============================================================================

setlocal

REM --- Pin the working directory to frontend/, derived from this script's path.
pushd "%~dp0..\.."
if errorlevel 1 goto badcwd
if not exist "package.json" goto nopkg
if not exist "scripts\content-engine\metricool-writeback.ts" goto noscript

echo [metricool-writeback-cron] %DATE% %TIME%  cwd=%CD%

REM --- Run it. --log writes the single agent_runs telemetry row. Extra args pass
REM     straight through, so `metricool-writeback-cron.cmd --dry-run` works.
call npx tsx "scripts\content-engine\metricool-writeback.ts" --log %*
set "WB_EXIT=%ERRORLEVEL%"

echo [metricool-writeback-cron] finished with exit %WB_EXIT%
popd
endlocal & exit /b %WB_EXIT%

:badcwd
echo [metricool-writeback-cron] FATAL: could not enter "%~dp0..\.." 1>&2
endlocal & exit /b 1

:nopkg
echo [metricool-writeback-cron] FATAL: no package.json in "%CD%". 1>&2
echo [metricool-writeback-cron] Expected the 09_website-app\frontend directory. 1>&2
popd
endlocal & exit /b 1

:noscript
echo [metricool-writeback-cron] FATAL: "%CD%" has a package.json but not the content-engine scripts. 1>&2
popd
endlocal & exit /b 1
