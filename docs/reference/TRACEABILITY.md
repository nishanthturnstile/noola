# Traceability and migration map

This index connects canonical requirements to delivery, technical responsibility and acceptance. It does not redefine requirement behavior or report passing tests.

[Documentation index](../README.md). Consolidated 3 October 2026; implementation and validation remain pending.

<a id="requirement-matrix"></a>
## Requirement matrix

All 205 catalog IDs are retained. Release classification is owned only by [the catalog](REQUIREMENTS.md#capability-catalog): 135 Release 1, 52 Expansion and 18 Conditional rows. A range denotes incremental coverage; the final core phase is the whole-row completion gate.

| Requirement | Delivery phase | Architecture responsibility | Validation family / required subcase |
|---|---|---|---|
| [ACC-01](REQUIREMENTS.md#acc-01) | 1; recipient and channel extensions in 2; full coverage 5 | Identity and Household Policy; Lifecycle and Portability | [V01.ACC-01](#v01) |
| [ACC-02](REQUIREMENTS.md#acc-02) | 1; recipient and channel extensions in 2; full coverage 5 | Identity and Household Policy; Lifecycle and Portability | [V01.ACC-02](#v01) |
| [ACC-03](REQUIREMENTS.md#acc-03) | 1; recipient and channel extensions in 2; full coverage 5 | Identity and Household Policy; Lifecycle and Portability | [V01.ACC-03](#v01) |
| [ACC-04](REQUIREMENTS.md#acc-04) | 1; recipient and channel extensions in 2; full coverage 5 | Identity and Household Policy; Lifecycle and Portability | [V01.ACC-04](#v01) |
| [ACC-05](REQUIREMENTS.md#acc-05) | 1; recipient and channel extensions in 2; full coverage 5 | Identity and Household Policy; Lifecycle and Portability | [V01.ACC-05](#v01) |
| [ACC-06](REQUIREMENTS.md#acc-06) | 1; recipient and channel extensions in 2; full coverage 5 | Identity and Household Policy; Lifecycle and Portability | [V01.ACC-06](#v01) |
| [ACC-07](REQUIREMENTS.md#acc-07) | 1; recipient and channel extensions in 2; full coverage 5 | Identity and Household Policy; Lifecycle and Portability | [V01.ACC-07](#v01) |
| [ACC-08](REQUIREMENTS.md#acc-08) | 1; recipient and channel extensions in 2; full coverage 5 | Identity and Household Policy; Lifecycle and Portability | [V01.ACC-08](#v01) |
| [ACC-09](REQUIREMENTS.md#acc-09) | 10, selected access track | Identity and Household Policy; selected access client | [V01.ACC-09](#v01) |
| [PER-01](REQUIREMENTS.md#per-01) | 1; new input coverage 3; full coverage 5 | Identity and Household Policy; AI Orchestration; Agenda and Plans | [V04.PER-01](#v04) |
| [PER-02](REQUIREMENTS.md#per-02) | 1; new input coverage 3; full coverage 5 | Identity and Household Policy; AI Orchestration; Agenda and Plans | [V04.PER-02](#v04) |
| [PER-03](REQUIREMENTS.md#per-03) | 1; new input coverage 3; full coverage 5 | Identity and Household Policy; AI Orchestration; Agenda and Plans | [V04.PER-03](#v04) |
| [PER-04](REQUIREMENTS.md#per-04) | 1; new input coverage 3; full coverage 5 | Identity and Household Policy; AI Orchestration; Agenda and Plans | [V04.PER-04](#v04) |
| [PER-05](REQUIREMENTS.md#per-05) | 1; new input coverage 3; full coverage 5 | Identity and Household Policy; AI Orchestration; Agenda and Plans | [V04.PER-05](#v04) |
| [PER-06](REQUIREMENTS.md#per-06) | 4 | Identity and Household Policy; AI Orchestration; Agenda and Plans | [V04.PER-06](#v04) |
| [PER-07](REQUIREMENTS.md#per-07) | 1; new input coverage 3; full coverage 5 | Identity and Household Policy; AI Orchestration; Agenda and Plans | [V04.PER-07](#v04) |
| [CTL-01](REQUIREMENTS.md#ctl-01) | 1 for initial records; extend 2–5; complete 5 | Lifecycle and Portability; Identity and Household Policy; Operations and Cost; all record owners | [V21.CTL-01](#v21) |
| [CTL-02](REQUIREMENTS.md#ctl-02) | 1 for initial records; extend 2–5; complete 5 | Lifecycle and Portability; Identity and Household Policy; Operations and Cost; all record owners | [V21.CTL-02](#v21) |
| [CTL-03](REQUIREMENTS.md#ctl-03) | 1 for initial records; extend 2–5; complete 5 | Lifecycle and Portability; Identity and Household Policy; Operations and Cost; all record owners | [V21.CTL-03](#v21) |
| [CTL-04](REQUIREMENTS.md#ctl-04) | 1 for initial records; extend 2–5; complete 5 | Lifecycle and Portability; Identity and Household Policy; Operations and Cost; all record owners | [V21.CTL-04](#v21) |
| [CTL-05](REQUIREMENTS.md#ctl-05) | 1 for initial records; extend 2–5; complete 5 | Lifecycle and Portability; Identity and Household Policy; Operations and Cost; all record owners | [V21.CTL-05](#v21) |
| [CTL-06](REQUIREMENTS.md#ctl-06) | 1 for initial records; extend 2–5; complete 5 | Lifecycle and Portability; Identity and Household Policy; Operations and Cost; all record owners | [V21.CTL-06](#v21) |
| [CTL-07](REQUIREMENTS.md#ctl-07) | 1 for initial records; extend 2–5; complete 5 | Lifecycle and Portability; Identity and Household Policy; Operations and Cost; all record owners | [V21.CTL-07](#v21) |
| [CTL-08](REQUIREMENTS.md#ctl-08) | 1 for initial records; extend 2–5; complete 5 | Lifecycle and Portability; Identity and Household Policy; Operations and Cost; all record owners | [V21.CTL-08](#v21) |
| [CTL-09](REQUIREMENTS.md#ctl-09) | 1 for initial records; extend 2–5; complete 5 | Lifecycle and Portability; Identity and Household Policy; Operations and Cost; all record owners | [V21.CTL-09](#v21) |
| [CTL-10](REQUIREMENTS.md#ctl-10) | 1 for initial records; extend 2–5; complete 5 | Lifecycle and Portability; Identity and Household Policy; Operations and Cost; all record owners | [V21.CTL-10](#v21) |
| [CON-01](REQUIREMENTS.md#con-01) | 1 for enabled actions; extend 2–4; complete 5 | Conversation and Actions; AI Orchestration; relevant record owners | [V02.CON-01](#v02) |
| [CON-02](REQUIREMENTS.md#con-02) | 1 for enabled actions; extend 2–4; complete 5 | Conversation and Actions; AI Orchestration; relevant record owners | [V02.CON-02](#v02) |
| [CON-03](REQUIREMENTS.md#con-03) | 1 for enabled actions; extend 2–4; complete 5 | Conversation and Actions; AI Orchestration; relevant record owners | [V02.CON-03](#v02) |
| [CON-04](REQUIREMENTS.md#con-04) | 1 for enabled actions; extend 2–4; complete 5 | Conversation and Actions; AI Orchestration; relevant record owners | [V02.CON-04](#v02) |
| [CON-05](REQUIREMENTS.md#con-05) | 1 for enabled actions; extend 2–4; complete 5 | Conversation and Actions; AI Orchestration; relevant record owners | [V02.CON-05](#v02) |
| [CON-06](REQUIREMENTS.md#con-06) | 1 for enabled actions; extend 2–4; complete 5 | Conversation and Actions; AI Orchestration; relevant record owners | [V02.CON-06](#v02) |
| [CON-07](REQUIREMENTS.md#con-07) | 1 for enabled actions; extend 2–4; complete 5 | Conversation and Actions; AI Orchestration; relevant record owners | [V02.CON-07](#v02) |
| [CON-08](REQUIREMENTS.md#con-08) | 1 for enabled actions; extend 2–4; complete 5 | Conversation and Actions; AI Orchestration; relevant record owners | [V02.CON-08](#v02) |
| [CON-09](REQUIREMENTS.md#con-09) | 7 | Conversation and Actions; AI Orchestration; Search and Retrieval | [V02.CON-09](#v02) |
| [CON-10](REQUIREMENTS.md#con-10) | 1 for enabled actions; extend 2–4; complete 5 | Conversation and Actions; AI Orchestration; relevant record owners | [V02.CON-10](#v02) |
| [CON-11](REQUIREMENTS.md#con-11) | 7 | Conversation and Actions; AI Orchestration; Search and Retrieval | [V02.CON-11](#v02) |
| [CON-12](REQUIREMENTS.md#con-12) | 10, selected media track | AI Orchestration; Files and Capture | [V02.CON-12](#v02) |
| [VOI-01](REQUIREMENTS.md#voi-01) | 3 | Files and Capture; Conversation and Actions; AI Orchestration; client | [V03.VOI-01](#v03) |
| [VOI-02](REQUIREMENTS.md#voi-02) | 3 | Files and Capture; Conversation and Actions; AI Orchestration; client | [V03.VOI-02](#v03) |
| [VOI-03](REQUIREMENTS.md#voi-03) | 3 | Files and Capture; Conversation and Actions; AI Orchestration; client | [V03.VOI-03](#v03) |
| [VOI-04](REQUIREMENTS.md#voi-04) | 3 | Files and Capture; Conversation and Actions; AI Orchestration; client | [V03.VOI-04](#v03) |
| [VOI-05](REQUIREMENTS.md#voi-05) | 3 | Files and Capture; Conversation and Actions; AI Orchestration; client | [V03.VOI-05](#v03) |
| [VOI-06](REQUIREMENTS.md#voi-06) | 3 | Files and Capture; Conversation and Actions; AI Orchestration; client | [V03.VOI-06](#v03) |
| [VOI-07](REQUIREMENTS.md#voi-07) | 3 | Files and Capture; Conversation and Actions; AI Orchestration; client | [V03.VOI-07](#v03) |
| [VOI-08](REQUIREMENTS.md#voi-08) | 3 | Files and Capture; Conversation and Actions; AI Orchestration; client | [V03.VOI-08](#v03) |
| [VOI-09](REQUIREMENTS.md#voi-09) | 10, selected voice track | Selected device client; Files and Capture; Identity and Household Policy | [V03.VOI-09](#v03) |
| [VOI-10](REQUIREMENTS.md#voi-10) | 3 | Files and Capture; Conversation and Actions; AI Orchestration; client | [V03.VOI-10](#v03) |
| [DEV-01](REQUIREMENTS.md#dev-01) | 1; extend with each workflow; complete 5 | Client; Identity and Household Policy; Conversation and Actions; Scheduling and Delivery | [V20.DEV-01](#v20) |
| [DEV-02](REQUIREMENTS.md#dev-02) | 1; extend with each workflow; complete 5 | Client; Identity and Household Policy; Conversation and Actions; Scheduling and Delivery | [V20.DEV-02](#v20) |
| [DEV-03](REQUIREMENTS.md#dev-03) | 1; extend with each workflow; complete 5 | Client; Identity and Household Policy; Conversation and Actions; Scheduling and Delivery | [V20.DEV-03](#v20) |
| [DEV-04](REQUIREMENTS.md#dev-04) | 1; extend with each workflow; complete 5 | Client; Identity and Household Policy; Conversation and Actions; Scheduling and Delivery | [V20.DEV-04](#v20) |
| [DEV-05](REQUIREMENTS.md#dev-05) | 1; extend with each workflow; complete 5 | Client; Identity and Household Policy; Conversation and Actions; Scheduling and Delivery | [V20.DEV-05](#v20) |
| [DEV-06](REQUIREMENTS.md#dev-06) | 1 session rules; 2 push; 3 voice/camera limitations; complete 5 | Client; Identity and Household Policy; Conversation and Actions; Scheduling and Delivery | [V20.DEV-06](#v20) |
| [DEV-07](REQUIREMENTS.md#dev-07) | 7 | Client; Conversation and Actions; Identity and Household Policy | [V20.DEV-07](#v20) |
| [DEV-08](REQUIREMENTS.md#dev-08) | 1 session rules; 2 push; 3 voice/camera limitations; complete 5 | Client; Identity and Household Policy; Conversation and Actions; Scheduling and Delivery | [V20.DEV-08](#v20) |
| [MEM-01](REQUIREMENTS.md#mem-01) | 1; lasting reminders 2 and files 3; complete 5 | Memory and Evidence; Search and Retrieval; Lifecycle and Portability; Conversation and Actions | [V05.MEM-01](#v05) |
| [MEM-02](REQUIREMENTS.md#mem-02) | 1; lasting reminders 2 and files 3; complete 5 | Memory and Evidence; Search and Retrieval; Lifecycle and Portability; Conversation and Actions | [V05.MEM-02](#v05) |
| [MEM-03](REQUIREMENTS.md#mem-03) | 1; lasting reminders 2 and files 3; complete 5 | Memory and Evidence; Search and Retrieval; Lifecycle and Portability; Conversation and Actions | [V05.MEM-03](#v05) |
| [MEM-04](REQUIREMENTS.md#mem-04) | 1; lasting reminders 2 and files 3; complete 5 | Memory and Evidence; Search and Retrieval; Lifecycle and Portability; Conversation and Actions | [V05.MEM-04](#v05) |
| [MEM-05](REQUIREMENTS.md#mem-05) | 1; lasting reminders 2 and files 3; complete 5 | Memory and Evidence; Search and Retrieval; Lifecycle and Portability; Conversation and Actions | [V05.MEM-05](#v05) |
| [MEM-06](REQUIREMENTS.md#mem-06) | 1; lasting reminders 2 and files 3; complete 5 | Memory and Evidence; Search and Retrieval; Lifecycle and Portability; Conversation and Actions | [V05.MEM-06](#v05) |
| [MEM-07](REQUIREMENTS.md#mem-07) | 1; lasting reminders 2 and files 3; complete 5 | Memory and Evidence; Search and Retrieval; Lifecycle and Portability; Conversation and Actions | [V05.MEM-07](#v05) |
| [MEM-08](REQUIREMENTS.md#mem-08) | 1; lasting reminders 2 and files 3; complete 5 | Memory and Evidence; Search and Retrieval; Lifecycle and Portability; Conversation and Actions | [V05.MEM-08](#v05) |
| [MEM-09](REQUIREMENTS.md#mem-09) | 1; lasting reminders 2 and files 3; complete 5 | Memory and Evidence; Search and Retrieval; Lifecycle and Portability; Conversation and Actions | [V05.MEM-09](#v05) |
| [MEM-10](REQUIREMENTS.md#mem-10) | 1; lasting reminders 2 and files 3; complete 5 | Memory and Evidence; Search and Retrieval; Lifecycle and Portability; Conversation and Actions | [V05.MEM-10](#v05) |
| [MEM-11](REQUIREMENTS.md#mem-11) | 7 | Memory and Evidence; Lifecycle and Portability; Search and Retrieval | [V05.MEM-11](#v05) |
| [MEM-12](REQUIREMENTS.md#mem-12) | 1; extend to all delivered records; complete 5 | Memory and Evidence; Search and Retrieval; Lifecycle and Portability; Conversation and Actions | [V05.MEM-12](#v05) |
| [MEM-13](REQUIREMENTS.md#mem-13) | 1; extend to all delivered records; complete 5 | Memory and Evidence; Search and Retrieval; Lifecycle and Portability; Conversation and Actions | [V05.MEM-13](#v05) |
| [MEM-14](REQUIREMENTS.md#mem-14) | 7 | Memory and Evidence; Lifecycle and Portability; Search and Retrieval | [V05.MEM-14](#v05) |
| [MEM-15](REQUIREMENTS.md#mem-15) | 1; extend to all delivered records; complete 5 | Memory and Evidence; Search and Retrieval; Lifecycle and Portability; Conversation and Actions | [V05.MEM-15](#v05) |
| [MEM-16](REQUIREMENTS.md#mem-16) | 7 | Memory and Evidence; Lifecycle and Portability; Search and Retrieval | [V05.MEM-16](#v05) |
| [MEM-17](REQUIREMENTS.md#mem-17) | 1; extend to all delivered records; complete 5 | Memory and Evidence; Search and Retrieval; Lifecycle and Portability; Conversation and Actions | [V05.MEM-17](#v05) |
| [SRC-01](REQUIREMENTS.md#src-01) | 1 for existing records; files 3; decisions 4; complete 5 | Search and Retrieval; source-owning domains | [V06.SRC-01](#v06) |
| [SRC-02](REQUIREMENTS.md#src-02) | 1 for existing records; files 3; decisions 4; complete 5 | Search and Retrieval; source-owning domains | [V06.SRC-02](#v06) |
| [SRC-03](REQUIREMENTS.md#src-03) | 1 for existing records; files 3; decisions 4; complete 5 | Search and Retrieval; source-owning domains | [V06.SRC-03](#v06) |
| [SRC-04](REQUIREMENTS.md#src-04) | 3 | AI Orchestration; web adapter | [V06.SRC-04](#v06) |
| [SRC-05](REQUIREMENTS.md#src-05) | 3 | AI Orchestration; web adapter | [V06.SRC-05](#v06) |
| [SRC-06](REQUIREMENTS.md#src-06) | 3 | AI Orchestration; web adapter | [V06.SRC-06](#v06) |
| [SRC-07](REQUIREMENTS.md#src-07) | 1 for existing records; files 3; decisions 4; complete 5 | Search and Retrieval; source-owning domains | [V06.SRC-07](#v06) |
| [SRC-08](REQUIREMENTS.md#src-08) | 7 | AI Orchestration; Search and Retrieval; Memory and Evidence | [V06.SRC-08](#v06) |
| [SRC-09](REQUIREMENTS.md#src-09) | 7 | AI Orchestration; Search and Retrieval; Memory and Evidence | [V06.SRC-09](#v06) |
| [SRC-10](REQUIREMENTS.md#src-10) | 10, separately selected search mode | Search and Retrieval; Files and Capture | [V06.SRC-10](#v06) |
| [DOC-01](REQUIREMENTS.md#doc-01) | 3; event-linked action extension 4; complete 5 | Files and Capture; AI Orchestration; Search and Retrieval; Lifecycle and Portability | [V07.DOC-01](#v07) |
| [DOC-02](REQUIREMENTS.md#doc-02) | 3; event-linked action extension 4; complete 5 | Files and Capture; AI Orchestration; Search and Retrieval; Lifecycle and Portability | [V07.DOC-02](#v07) |
| [DOC-03](REQUIREMENTS.md#doc-03) | 3; event-linked action extension 4; complete 5 | Files and Capture; AI Orchestration; Search and Retrieval; Lifecycle and Portability | [V07.DOC-03](#v07) |
| [DOC-04](REQUIREMENTS.md#doc-04) | 3; event-linked action extension 4; complete 5 | Files and Capture; AI Orchestration; Search and Retrieval; Lifecycle and Portability | [V07.DOC-04](#v07) |
| [DOC-05](REQUIREMENTS.md#doc-05) | 3; event-linked action extension 4; complete 5 | Files and Capture; AI Orchestration; Search and Retrieval; Lifecycle and Portability | [V07.DOC-05](#v07) |
| [DOC-06](REQUIREMENTS.md#doc-06) | 3; event-linked action extension 4; complete 5 | Files and Capture; AI Orchestration; Search and Retrieval; Lifecycle and Portability | [V07.DOC-06](#v07) |
| [DOC-07](REQUIREMENTS.md#doc-07) | 3; event-linked action extension 4; complete 5 | Files and Capture; AI Orchestration; Search and Retrieval; Lifecycle and Portability | [V07.DOC-07](#v07) |
| [DOC-08](REQUIREMENTS.md#doc-08) | 3; event-linked action extension 4; complete 5 | Files and Capture; AI Orchestration; Search and Retrieval; Lifecycle and Portability | [V07.DOC-08](#v07) |
| [DOC-09](REQUIREMENTS.md#doc-09) | 3; event-linked action extension 4; complete 5 | Files and Capture; AI Orchestration; Search and Retrieval; Lifecycle and Portability | [V07.DOC-09](#v07) |
| [DOC-10](REQUIREMENTS.md#doc-10) | 3; event-linked action extension 4; complete 5 | Files and Capture; AI Orchestration; Search and Retrieval; Lifecycle and Portability | [V07.DOC-10](#v07) |
| [DOC-11](REQUIREMENTS.md#doc-11) | 10, selected live-input track | Selected capture client; Files and Capture | [V07.DOC-11](#v07) |
| [DOC-12](REQUIREMENTS.md#doc-12) | 3; event-linked action extension 4; complete 5 | Files and Capture; AI Orchestration; Search and Retrieval; Lifecycle and Portability | [V07.DOC-12](#v07) |
| [TSK-01](REQUIREMENTS.md#tsk-01) | 1 shared-list subset; 2 complete task/request behavior | Lists and Tasks; Identity and Household Policy; Scheduling and Delivery | [V08.TSK-01](#v08) |
| [TSK-02](REQUIREMENTS.md#tsk-02) | 1 shared-list subset; 2 complete task/request behavior | Lists and Tasks; Identity and Household Policy; Scheduling and Delivery | [V08.TSK-02](#v08) |
| [TSK-03](REQUIREMENTS.md#tsk-03) | 1 shared-list subset; 2 complete task/request behavior | Lists and Tasks; Identity and Household Policy; Scheduling and Delivery | [V08.TSK-03](#v08) |
| [TSK-04](REQUIREMENTS.md#tsk-04) | 1 shared-list subset; 2 complete task/request behavior | Lists and Tasks; Identity and Household Policy; Scheduling and Delivery | [V08.TSK-04](#v08) |
| [TSK-05](REQUIREMENTS.md#tsk-05) | 1 shared-list subset; 2 complete task/request behavior | Lists and Tasks; Identity and Household Policy; Scheduling and Delivery | [V08.TSK-05](#v08) |
| [TSK-06](REQUIREMENTS.md#tsk-06) | 1 shared-list subset; 2 complete task/request behavior | Lists and Tasks; Identity and Household Policy; Scheduling and Delivery | [V08.TSK-06](#v08) |
| [TSK-07](REQUIREMENTS.md#tsk-07) | 4 | Lists and Tasks; Agenda and Plans; Scheduling and Delivery | [V08.TSK-07](#v08) |
| [TSK-08](REQUIREMENTS.md#tsk-08) | 4 | Lists and Tasks; Agenda and Plans; Scheduling and Delivery | [V08.TSK-08](#v08) |
| [TSK-09](REQUIREMENTS.md#tsk-09) | 1 shared-list subset; 2 complete task/request behavior | Lists and Tasks; Identity and Household Policy; Scheduling and Delivery | [V08.TSK-09](#v08) |
| [TSK-10](REQUIREMENTS.md#tsk-10) | 1 shared-list subset; 2 complete task/request behavior | Lists and Tasks; Identity and Household Policy; Scheduling and Delivery | [V08.TSK-10](#v08) |
| [REM-01](REQUIREMENTS.md#rem-01) | 2 one-time schedules; recurrence policy extensions 4; complete 5 | Scheduling and Delivery; Identity and Household Policy | [V09.REM-01](#v09) |
| [REM-02](REQUIREMENTS.md#rem-02) | 2 one-time schedules; recurrence policy extensions 4; complete 5 | Scheduling and Delivery; Identity and Household Policy | [V09.REM-02](#v09) |
| [REM-03](REQUIREMENTS.md#rem-03) | 4 | Scheduling and Delivery; Agenda and Plans | [V09.REM-03](#v09) |
| [REM-04](REQUIREMENTS.md#rem-04) | 2 one-time schedules; recurrence policy extensions 4; complete 5 | Scheduling and Delivery; Identity and Household Policy | [V09.REM-04](#v09) |
| [REM-05](REQUIREMENTS.md#rem-05) | 2 one-time schedules; recurrence policy extensions 4; complete 5 | Scheduling and Delivery; Identity and Household Policy | [V09.REM-05](#v09) |
| [REM-06](REQUIREMENTS.md#rem-06) | 2 one-time schedules; recurrence policy extensions 4; complete 5 | Scheduling and Delivery; Identity and Household Policy | [V09.REM-06](#v09) |
| [REM-07](REQUIREMENTS.md#rem-07) | 2 one-time schedules; recurrence policy extensions 4; complete 5 | Scheduling and Delivery; Identity and Household Policy | [V09.REM-07](#v09) |
| [REM-08](REQUIREMENTS.md#rem-08) | 2 one-time schedules; recurrence policy extensions 4; complete 5 | Scheduling and Delivery; Identity and Household Policy | [V09.REM-08](#v09) |
| [REM-09](REQUIREMENTS.md#rem-09) | 2 one-time schedules; recurrence policy extensions 4; complete 5 | Scheduling and Delivery; Identity and Household Policy | [V09.REM-09](#v09) |
| [REM-10](REQUIREMENTS.md#rem-10) | 4 | Scheduling and Delivery; Agenda and Plans | [V09.REM-10](#v09) |
| [REM-11](REQUIREMENTS.md#rem-11) | 8, selected timing track | Scheduling and Delivery; selected device capability | [V09.REM-11](#v09) |
| [REM-12](REQUIREMENTS.md#rem-12) | 2 one-time schedules; recurrence policy extensions 4; complete 5 | Scheduling and Delivery; Identity and Household Policy | [V09.REM-12](#v09) |
| [REM-13](REQUIREMENTS.md#rem-13) | 8, selected timing track | Scheduling and Delivery; selected device capability | [V09.REM-13](#v09) |
| [REM-14](REQUIREMENTS.md#rem-14) | 10, separate device gate | Selected device capability; Scheduling and Delivery | [V09.REM-14](#v09) |
| [COM-01](REQUIREMENTS.md#com-01) | 2 | Communication and Decisions; Scheduling and Delivery | [V10.COM-01](#v10) |
| [COM-02](REQUIREMENTS.md#com-02) | 2 | Communication and Decisions; Scheduling and Delivery | [V10.COM-02](#v10) |
| [COM-03](REQUIREMENTS.md#com-03) | 2 | Communication and Decisions; Scheduling and Delivery | [V10.COM-03](#v10) |
| [COM-04](REQUIREMENTS.md#com-04) | 2 | Communication and Decisions; Scheduling and Delivery | [V10.COM-04](#v10) |
| [COM-05](REQUIREMENTS.md#com-05) | 4 | Communication and Decisions; source owners; Search and Retrieval | [V10.COM-05](#v10) |
| [COM-06](REQUIREMENTS.md#com-06) | 4 | Communication and Decisions; source owners; Search and Retrieval | [V10.COM-06](#v10) |
| [COM-07](REQUIREMENTS.md#com-07) | 2 | Communication and Decisions; Scheduling and Delivery | [V10.COM-07](#v10) |
| [COM-08](REQUIREMENTS.md#com-08) | 5 | Communication and Decisions; Scheduling and Delivery | [V10.COM-08](#v10) |
| [COM-09](REQUIREMENTS.md#com-09) | 2 | Communication and Decisions; Scheduling and Delivery | [V10.COM-09](#v10) |
| [CAL-01](REQUIREMENTS.md#cal-01) | 4 | Agenda and Plans; Lists and Tasks; Scheduling and Delivery; Conversation and Actions | [V11.CAL-01](#v11) |
| [CAL-02](REQUIREMENTS.md#cal-02) | 4 | Agenda and Plans; Lists and Tasks; Scheduling and Delivery; Conversation and Actions | [V11.CAL-02](#v11) |
| [CAL-03](REQUIREMENTS.md#cal-03) | 4 | Agenda and Plans; Lists and Tasks; Scheduling and Delivery; Conversation and Actions | [V11.CAL-03](#v11) |
| [CAL-04](REQUIREMENTS.md#cal-04) | 4 | Agenda and Plans; Lists and Tasks; Scheduling and Delivery; Conversation and Actions | [V11.CAL-04](#v11) |
| [CAL-05](REQUIREMENTS.md#cal-05) | 4 | Agenda and Plans; Lists and Tasks; Scheduling and Delivery; Conversation and Actions | [V11.CAL-05](#v11) |
| [CAL-06](REQUIREMENTS.md#cal-06) | 4 | Agenda and Plans; Lists and Tasks; Scheduling and Delivery; Conversation and Actions | [V11.CAL-06](#v11) |
| [CAL-07](REQUIREMENTS.md#cal-07) | 4 | Agenda and Plans; Lists and Tasks; Scheduling and Delivery; Conversation and Actions | [V11.CAL-07](#v11) |
| [CAL-08](REQUIREMENTS.md#cal-08) | 9, conditional read gate then selected write gate | Connections; Agenda and Plans | [V11.CAL-08](#v11) |
| [CAL-09](REQUIREMENTS.md#cal-09) | 4 | Agenda and Plans; Lists and Tasks; Scheduling and Delivery; Conversation and Actions | [V11.CAL-09](#v11) |
| [PRO-01](REQUIREMENTS.md#pro-01) | 5 | Scheduling and Delivery; AI Orchestration; source owners | [V12.PRO-01](#v12) |
| [PRO-02](REQUIREMENTS.md#pro-02) | 5 | Scheduling and Delivery; AI Orchestration; source owners | [V12.PRO-02](#v12) |
| [PRO-03](REQUIREMENTS.md#pro-03) | 5 | Scheduling and Delivery; AI Orchestration; source owners | [V12.PRO-03](#v12) |
| [PRO-04](REQUIREMENTS.md#pro-04) | 8; selected connected sources additionally require 9 | Scheduling and Delivery; AI Orchestration; Connections when applicable | [V12.PRO-04](#v12) |
| [PRO-05](REQUIREMENTS.md#pro-05) | 8; selected connected sources additionally require 9 | Scheduling and Delivery; AI Orchestration; Connections when applicable | [V12.PRO-05](#v12) |
| [PRO-06](REQUIREMENTS.md#pro-06) | 8; selected connected sources additionally require 9 | Scheduling and Delivery; AI Orchestration; Connections when applicable | [V12.PRO-06](#v12) |
| [PRO-07](REQUIREMENTS.md#pro-07) | 5 | Scheduling and Delivery; AI Orchestration; source owners | [V12.PRO-07](#v12) |
| [PRO-08](REQUIREMENTS.md#pro-08) | 8; selected connected sources additionally require 9 | Scheduling and Delivery; AI Orchestration; Connections when applicable | [V12.PRO-08](#v12) |
| [PRO-09](REQUIREMENTS.md#pro-09) | 5 | Scheduling and Delivery; AI Orchestration; source owners | [V12.PRO-09](#v12) |
| [PRO-10](REQUIREMENTS.md#pro-10) | 5 | Scheduling and Delivery; AI Orchestration; source owners | [V12.PRO-10](#v12) |
| [PRO-11](REQUIREMENTS.md#pro-11) | 8; selected connected sources additionally require 9 | Scheduling and Delivery; AI Orchestration; Connections when applicable | [V12.PRO-11](#v12) |
| [HOM-01](REQUIREMENTS.md#hom-01) | 8, selected home track | Selected Home Knowledge; Lists and Tasks; Files and Capture | [V13.HOM-01](#v13) |
| [HOM-02](REQUIREMENTS.md#hom-02) | 8, selected home track | Selected Home Knowledge; Lists and Tasks; Files and Capture | [V13.HOM-02](#v13) |
| [HOM-03](REQUIREMENTS.md#hom-03) | 8, selected home track | Selected Home Knowledge; Lists and Tasks; Files and Capture | [V13.HOM-03](#v13) |
| [HOM-04](REQUIREMENTS.md#hom-04) | 8, selected home track | Selected Home Knowledge; Lists and Tasks; Files and Capture | [V13.HOM-04](#v13) |
| [HOM-05](REQUIREMENTS.md#hom-05) | 8, selected home track | Selected Home Knowledge; Lists and Tasks; Files and Capture | [V13.HOM-05](#v13) |
| [HOM-06](REQUIREMENTS.md#hom-06) | 8, selected home track | Selected Home Knowledge; Lists and Tasks; Files and Capture | [V13.HOM-06](#v13) |
| [HOM-07](REQUIREMENTS.md#hom-07) | 8, selected home track | Selected Home Knowledge; Lists and Tasks; Files and Capture | [V13.HOM-07](#v13) |
| [HOM-08](REQUIREMENTS.md#hom-08) | 1 | Memory and Evidence; Search and Retrieval | [V13.HOM-08](#v13) |
| [ADM-01](REQUIREMENTS.md#adm-01) | 8, selected administration track | Selected Administration; Files and Capture; Communication and Decisions; Scheduling and Delivery | [V14.ADM-01](#v14) |
| [ADM-02](REQUIREMENTS.md#adm-02) | 8, selected administration track | Selected Administration; Files and Capture; Communication and Decisions; Scheduling and Delivery | [V14.ADM-02](#v14) |
| [ADM-03](REQUIREMENTS.md#adm-03) | 8, selected administration track | Selected Administration; Files and Capture; Communication and Decisions; Scheduling and Delivery | [V14.ADM-03](#v14) |
| [ADM-04](REQUIREMENTS.md#adm-04) | 8, selected administration track | Selected Administration; Files and Capture; Communication and Decisions; Scheduling and Delivery | [V14.ADM-04](#v14) |
| [ADM-05](REQUIREMENTS.md#adm-05) | 8, selected administration track | Selected Administration; Files and Capture; Communication and Decisions; Scheduling and Delivery | [V14.ADM-05](#v14) |
| [ADM-06](REQUIREMENTS.md#adm-06) | 1 boundary; persists across all phases | Conversation and Actions; AI Orchestration; Identity and Household Policy | [V14.ADM-06](#v14) |
| [WEL-01](REQUIREMENTS.md#wel-01) | 8, selected care track | Selected Wellbeing; Memory and Evidence; Scheduling and Delivery | [V15.WEL-01](#v15) |
| [WEL-02](REQUIREMENTS.md#wel-02) | 8, selected care track | Selected Wellbeing; Memory and Evidence; Scheduling and Delivery | [V15.WEL-02](#v15) |
| [WEL-03](REQUIREMENTS.md#wel-03) | 8, selected care track | Selected Wellbeing; Memory and Evidence; Scheduling and Delivery | [V15.WEL-03](#v15) |
| [WEL-04](REQUIREMENTS.md#wel-04) | 8, selected care track | Selected Wellbeing; Memory and Evidence; Scheduling and Delivery | [V15.WEL-04](#v15) |
| [WEL-05](REQUIREMENTS.md#wel-05) | 8, selected care track | Selected Wellbeing; Memory and Evidence; Scheduling and Delivery | [V15.WEL-05](#v15) |
| [WEL-06](REQUIREMENTS.md#wel-06) | 1 retained-record protection; 4 general handovers; complete 5 | Identity and Household Policy; Communication and Decisions; record owners | [V15.WEL-06](#v15) |
| [CHD-01](REQUIREMENTS.md#chd-01) | 1; enforce throughout later phases | Identity and Household Policy; Memory and Evidence | [V16.CHD-01](#v16) |
| [CHD-02](REQUIREMENTS.md#chd-02) | 8, selected dependent-support track | Selected Dependent Support; Communication and Decisions; Scheduling and Delivery | [V16.CHD-02](#v16) |
| [CHD-03](REQUIREMENTS.md#chd-03) | 8, selected dependent-support track | Selected Dependent Support; Communication and Decisions; Scheduling and Delivery | [V16.CHD-03](#v16) |
| [CHD-04](REQUIREMENTS.md#chd-04) | 8, selected dependent-support track | Selected Dependent Support; Communication and Decisions; Scheduling and Delivery | [V16.CHD-04](#v16) |
| [CHD-05](REQUIREMENTS.md#chd-05) | 8, selected dependent-support track | Selected Dependent Support; Communication and Decisions; Scheduling and Delivery | [V16.CHD-05](#v16) |
| [CHD-06](REQUIREMENTS.md#chd-06) | 1; enforce throughout later phases | Identity and Household Policy; Memory and Evidence | [V16.CHD-06](#v16) |
| [CHD-07](REQUIREMENTS.md#chd-07) | 10, selected child track | Selected child client; Identity and Household Policy; AI Orchestration | [V16.CHD-07](#v16) |
| [CHD-08](REQUIREMENTS.md#chd-08) | 10, selected child track | Selected child client; Identity and Household Policy; AI Orchestration | [V16.CHD-08](#v16) |
| [CHD-09](REQUIREMENTS.md#chd-09) | 10, selected child track | Selected child client; Identity and Household Policy; AI Orchestration | [V16.CHD-09](#v16) |
| [CHD-10](REQUIREMENTS.md#chd-10) | 1; enforce throughout later phases | Identity and Household Policy; Memory and Evidence | [V16.CHD-10](#v16) |
| [JRN-01](REQUIREMENTS.md#jrn-01) | 8, selected history track | Selected Family History; Memory and Evidence; Files and Capture | [V17.JRN-01](#v17) |
| [JRN-02](REQUIREMENTS.md#jrn-02) | 8, selected history track | Selected Family History; Memory and Evidence; Files and Capture | [V17.JRN-02](#v17) |
| [JRN-03](REQUIREMENTS.md#jrn-03) | 8, selected history track | Selected Family History; Memory and Evidence; Files and Capture | [V17.JRN-03](#v17) |
| [JRN-04](REQUIREMENTS.md#jrn-04) | 8, selected history track | Selected Family History; Memory and Evidence; Files and Capture | [V17.JRN-04](#v17) |
| [JRN-05](REQUIREMENTS.md#jrn-05) | 8, selected history track | Selected Family History; Memory and Evidence; Files and Capture | [V17.JRN-05](#v17) |
| [JRN-06](REQUIREMENTS.md#jrn-06) | 1 text labels; 3 original media; complete 5 | Content-owning domains; Files and Capture; Lifecycle and Portability | [V17.JRN-06](#v17) |
| [LRN-01](REQUIREMENTS.md#lrn-01) | 8, selected learning track | Selected Learning; AI Orchestration; Scheduling and Delivery | [V18.LRN-01](#v18) |
| [LRN-02](REQUIREMENTS.md#lrn-02) | 8, selected learning track | Selected Learning; AI Orchestration; Scheduling and Delivery | [V18.LRN-02](#v18) |
| [LRN-03](REQUIREMENTS.md#lrn-03) | 8, selected learning track | Selected Learning; AI Orchestration; Scheduling and Delivery | [V18.LRN-03](#v18) |
| [LRN-04](REQUIREMENTS.md#lrn-04) | 8, selected learning track | Selected Learning; AI Orchestration; Scheduling and Delivery | [V18.LRN-04](#v18) |
| [LRN-05](REQUIREMENTS.md#lrn-05) | 10; 9 prerequisite for connected playback | Selected device client; Connections | [V18.LRN-05](#v18) |
| [LRN-06](REQUIREMENTS.md#lrn-06) | 10; 9 prerequisite for connected playback | Selected device client; Connections | [V18.LRN-06](#v18) |
| [INT-01](REQUIREMENTS.md#int-01) | 9 read stage | Connections; source owners; Lifecycle and Portability | [V19.INT-01](#v19) |
| [INT-02](REQUIREMENTS.md#int-02) | 9 read stage | Connections; source owners; Lifecycle and Portability | [V19.INT-02](#v19) |
| [INT-03](REQUIREMENTS.md#int-03) | 9 write stage after read-stage evidence | Connections; Conversation and Actions | [V19.INT-03](#v19) |
| [INT-04](REQUIREMENTS.md#int-04) | 9 read stage | Connections; source owners; Lifecycle and Portability | [V19.INT-04](#v19) |
| [INT-05](REQUIREMENTS.md#int-05) | 9 read stage | Connections; source owners; Lifecycle and Portability | [V19.INT-05](#v19) |
| [INT-06](REQUIREMENTS.md#int-06) | 1; file/web coverage 3; complete 5; persists thereafter | AI Orchestration; Conversation and Actions; all adapters | [V19.INT-06](#v19) |
| [INT-07](REQUIREMENTS.md#int-07) | 9 read stage | Connections; source owners; Lifecycle and Portability | [V19.INT-07](#v19) |
| [INT-08](REQUIREMENTS.md#int-08) | 9 read stage | Connections; source owners; Lifecycle and Portability | [V19.INT-08](#v19) |
| [INT-09](REQUIREMENTS.md#int-09) | 1; file/web coverage 3; complete 5; persists thereafter | AI Orchestration; Conversation and Actions; all adapters | [V19.INT-09](#v19) |
| [HME-01](REQUIREMENTS.md#hme-01) | 10, selected home-device track | Selected device client; Identity and Household Policy; Connections; Scheduling and Delivery | [V22.HME-01](#v22) |
| [HME-02](REQUIREMENTS.md#hme-02) | 10, selected home-device track | Selected device client; Identity and Household Policy; Connections; Scheduling and Delivery | [V22.HME-02](#v22) |
| [HME-03](REQUIREMENTS.md#hme-03) | 10, selected home-device track | Selected device client; Identity and Household Policy; Connections; Scheduling and Delivery | [V22.HME-03](#v22) |
| [HME-04](REQUIREMENTS.md#hme-04) | 10, selected home-device track | Selected device client; Identity and Household Policy; Connections; Scheduling and Delivery | [V22.HME-04](#v22) |
| [HME-05](REQUIREMENTS.md#hme-05) | 10, selected home-device track | Selected device client; Identity and Household Policy; Connections; Scheduling and Delivery | [V22.HME-05](#v22) |
| [HME-06](REQUIREMENTS.md#hme-06) | 10, selected home-device track | Selected device client; Identity and Household Policy; Connections; Scheduling and Delivery | [V22.HME-06](#v22) |

Responsibilities refer to the [module contracts](APPLICATION-DESIGN.md#module-contracts). Client responsibilities belong to the application client; selected future domains remain inactive until their branch is selected. “All modules” means each domain owning an enabled record type.

<a id="validation-families"></a>
## Validation families

Each catalog row requires its own subcase under the family below. These existing scenarios supply reusable evidence, not permission to mark an untested row complete.

| Family | Requirement range | Main scenario evidence |
|---|---|---|
| <a id="v01"></a>V01 Identity | ACC-01 through ACC-09 | T01, T02, T09, X11, X18, X23, X33 |
| <a id="v02"></a>V02 Conversation | CON-01 through CON-12 | T06, T07, T08, T30, X12, X13, X27 |
| <a id="v03"></a>V03 Voice | VOI-01 through VOI-10 | T07, T17, T18, X23, X29 |
| <a id="v04"></a>V04 Personalization | PER-01 through PER-07 | T01, T05, X02, F03 |
| <a id="v05"></a>V05 Memory | MEM-01 through MEM-17 | T04, T05, T23, T24, T26, X01, X02, X25, X35 |
| <a id="v06"></a>V06 Retrieval | SRC-01 through SRC-10 | T02, T06, T21, T22, X02, X24, X34 |
| <a id="v07"></a>V07 Files | DOC-01 through DOC-12 | T19, T20, T32, X01, X21, X24 |
| <a id="v08"></a>V08 Tasks | TSK-01 through TSK-10 | T13, T15, T29, X08, X09, X22 |
| <a id="v09"></a>V09 Reminders | REM-01 through REM-14 | T10 through T16, X08 through X11, X15, X16 |
| <a id="v10"></a>V10 Communication | COM-01 through COM-09 | T03, T13, T33, X03 through X06, X26, X28, X32 |
| <a id="v11"></a>V11 Agenda | CAL-01 through CAL-09 | T10, T34, X14, X15, X31 |
| <a id="v12"></a>V12 Proactivity | PRO-01 through PRO-11 | T28, T31, T35, X14, X16, X20 |
| <a id="v13"></a>V13 Home knowledge | HOM-01 through HOM-08 | T32, F06, F10; last-recorded-location check for HOM-08 |
| <a id="v14"></a>V14 Administration | ADM-01 through ADM-06 | T38, F06, F08; unsupported spending check for ADM-06 |
| <a id="v15"></a>V15 Wellbeing | WEL-01 through WEL-06 | T33, F09, X01, X07 |
| <a id="v16"></a>V16 Dependent | CHD-01 through CHD-10 | T01, T33, T43, X07, X18 |
| <a id="v17"></a>V17 Family history | JRN-01 through JRN-06 | T26, T39, X04, X05 |
| <a id="v18"></a>V18 Learning | LRN-01 through LRN-06 | T40, F18; all rows deferred |
| <a id="v19"></a>V19 Connections | INT-01 through INT-09 | T19, T30, T36, T37, X12, X27 |
| <a id="v20"></a>V20 Devices | DEV-01 through DEV-08 | T12, T16 through T18, T25, X17, X23, X29 |
| <a id="v21"></a>V21 Controls | CTL-01 through CTL-10 | T22 through T28, X18 through X20, X24, X25, X30, X33, X35 |
| <a id="v22"></a>V22 Home devices | HME-01 through HME-06 | T42, F16, X23; dedicated home devices deferred |

<a id="cross-cutting-mapping"></a>
## Cross-cutting mapping

The following non-catalog requirements and future directions also receive explicit ownership. Their source references supplement the catalog table rather than duplicate its rows.

| Product Capability / Feature | Product Plan Reference | Roadmap Phase | MVP? | Status |
|---|---|---|---|---|
| Progressive onboarding and chosen defaults | [Functional Requirements](REQUIREMENTS.md#functional-requirements) FR-001; [Product Experience Principles](PRODUCT-RULES.md#experience-principles) navigation | 1; push completion 2; extend through 5 | Yes | Confirmed scope; accepted sequence |
| Voice-processing disclosure, five-minute capture limit | [Functional Requirements](REQUIREMENTS.md#functional-requirements) FR-002 | 3 | Yes | Confirmed scope; accepted sequence |
| Supported file limits, temporary analysis and accessible controls | [Functional Requirements](REQUIREMENTS.md#functional-requirements) FR-003 | Accessibility from 1; file contract 3 | Yes | Confirmed scope; accepted sequence |
| Authorized export formats, manifest, recovery and independent guide | [Functional Requirements](REQUIREMENTS.md#functional-requirements) FR-004, FR-009 | 1 for existing data; every new type; complete 5 | Yes | Confirmed scope; accepted sequence |
| 10 GB capacity, warnings and representative retrieval load | [Functional Requirements](REQUIREMENTS.md#functional-requirements) FR-005 | Capacity with retained data from 1; files 3; complete load evidence 5 | Yes | Confirmed scope; accepted sequence |
| Offline session drafts and reviewed reconnection | [Functional Requirements](REQUIREMENTS.md#functional-requirements) FR-006 | 1; schedule cases 2 | Yes | Confirmed scope; accepted sequence |
| Reviewed plan changes and per-record outcomes | [Functional Requirements](REQUIREMENTS.md#functional-requirements) FR-007 | 4 | Yes | Confirmed scope; accepted sequence |
| Global search, authoritative cards, persistent approvals and failures | [Functional Requirements](REQUIREMENTS.md#functional-requirements) FR-008; [Product Experience Principles](PRODUCT-RULES.md#experience-principles) Talk, Today, Family, Memory, Settings | 1 minimal enabled navigation; extend through 5 | Yes | Confirmed foundation; no speculative areas |
| Authentication, rights, snapshot disclosure, exit and guardian authority | [Business Rules](PRODUCT-RULES.md#business-rules) BR-001–BR-005; [Roles and Permissions](PRODUCT-RULES.md#roles-and-permissions) roles | 1 enabled rights; snapshots 2; handovers/decisions 4; complete 5 | Yes | Policy decided; implementation evidence pending |
| History, processing, retention, correction and forgetting | [Business Rules](PRODUCT-RULES.md#business-rules) BR-006–BR-009 | 1 for initial records; every operation/type; complete 5 | Yes | Policy decided; implementation evidence pending |
| Intent approval, requests, linked state and time policies | [Business Rules](PRODUCT-RULES.md#business-rules) BR-010–BR-013 | 1 intent; 2 requests/schedules; 4 recurrence/plans; 5 routines | Yes | Confirmed scope; accepted sequence |
| Channels, budgets, expiry warnings, brief freshness and fallback | [Notifications and Communication](PRODUCT-RULES.md#notifications) | 1 applicable notices; 2 push; 5 complete routine behavior | Yes | Confirmed scope; accepted sequence |
| Platforms, languages, privacy, INR 3,000 budget and maintenance | [Product Constraints](PRODUCT-RULES.md#operating-constraints) | 0 feasibility; controls 1 onward; complete gate 5; observed operation 6 | Yes | Confirmed constraints; all optional AI routes pause at paid exhaustion; evidence pending |
| Complete quality and acceptance evidence | [Success Metrics](ACCEPTANCE.md#quality-and-evaluation) QLT-01–QLT-16, T01–T45, X01–X35, V01–V22 | Incremental; Release 1 gate 5; future cases 7–10 | Yes for applicable Release 1 cases | Required evidence, not measured results |
| Four-week pilot and focused revision observation | [Success Metrics](ACCEPTANCE.md#quality-and-evaluation) household pilot; [MVP Scope](../PRODUCT-PLAN.md#release-scope) checkpoint D | 6 | Yes, MVP success evidence | Confirmed evaluation; not yet run |
| Failures, privacy incidents and recovery degradation | [Risks and Product Challenges](PRODUCT-RULES.md#risks-and-incidents) | 1 for enabled use; extend each phase | Yes | Confirmed scope; accepted sequence |
| Actual processor, operator, recovery and feasibility boundaries | [Technical direction and phased detail](../TECH-STACK.md#selection-inventory); [Decision status and remaining evidence](DECISIONS-AND-GATES.md#legacy-decision-index) Q-07–Q-09 | 0 and before each affected operation; complete core gate 5 | Yes | Nonproduction residency/no-training/processor-retention exemptions decided; production and technical evidence required |
| External email, SMS and messaging channels | [Integrations](REQUIREMENTS.md#integration-scope); [Post-MVP Capabilities](../PRODUCT-PLAN.md#release-scope) | 9, separately enabled channel | No | Future Expansion |
| External task synchronization and event triggers | [Integrations](REQUIREMENTS.md#integration-scope); [MVP Scope](../PRODUCT-PLAN.md#release-scope)–[Post-MVP Capabilities](../PRODUCT-PLAN.md#release-scope) | 9 evaluation; delivery awaits RD-011 | No | Future Conditional; contract incomplete |
| Specialist finance integration direction | [Integrations](REQUIREMENTS.md#integration-scope); [Post-MVP Capabilities](../PRODUCT-PLAN.md#release-scope); [Product Capabilities](REQUIREMENTS.md#capability-catalog) administration note | 9 evaluation only if selected; RD-011 | No | Future exploratory direction; no committed service |

[FR requirements](REQUIREMENTS.md#functional-requirements), [BR policies](PRODUCT-RULES.md#business-rules), [QLT targets](ACCEPTANCE.md#quality-and-evaluation) and [DAR technical necessities](APPLICATION-DESIGN.md#derived-requirements) are separate binding layers. DAR-001–DAR-012 retain their individual source links and reasoning; they do not add product scope.

<a id="sequencing-notes"></a>
## Sequencing notes

### Dependency Assumptions

- Splitting checkpoint A into Phases 1 and 2 is an accepted delivery decision. The private memory and shared-list subset can provide meaningful test value before reminders, provided all controls for its enabled records pass. The source's complete A gate is still required before B.
- A minimal set of Talk, Today, Family, Memory, and Settings functions appears as its capabilities become available under FR-008 and [Roadmap Conversion Notes](TRACEABILITY.md#sequencing-notes). This does not require building empty navigation areas or choosing an application framework.
- Search, export, correction, forgetting, recovery, and cost controls grow with enabled record types. A type is not usable before its controls exist. Whole-product row acceptance waits until Phase 5.
- Phase 3 precedes Phase 4 to honor the source A–B–C progression and test risky inputs early. Manual agenda logic has no intrinsic dependency on speech; independent specification work can proceed without weakening the B evidence gate.
- Permission and freshness checks precede generated-output delivery. Briefs require current structured records and schedule control, while watched external sources additionally require the selected connection's read gate.
- Phases 7–10 are independent selection branches where possible. Phase 8 does not require all of Phase 7, and Phase 10 does not require all future modules or every connection.
- Within Phase 9, reading and disconnect evidence precede writes. A calendar can remain read-only, and a conditional device track may remain disabled indefinitely.
- Product-level feasibility evidence is needed early, but the roadmap neither chooses nor requires a particular architecture. Infeasibility prompts an explicit product revision rather than hidden scope reduction.


### Potential Scope Issues

- A specialist module must not delay or replace already approved general notes, checklists, stories, handovers, or document reminders.
- Future protective rules in WEL-06, CHD-06, CHD-10, JRN-06, ADM-06, and INT-06/INT-09 apply during Release 1. Their presence does not activate a specialist feature.
- "Conditional watch" is an Expansion feature under PRO-05, not the source's Conditional release classification.
- Reviewed external actions remain unavailable in Release 1. Future exact-action approval is a necessary boundary, not blanket permission to add arbitrary actions.
- The ordinary manual agenda does not require an external calendar. Generic handovers do not require a caregiver role or clinical module. Parent-led learning does not require child login.
- No phase introduces a public launch, subscriptions, broad analytics, additional household personas, autonomous spending, new integrations by name, or a new operational budget.
- Only the existing four-week pilot, two-week re-observation, and source test windows are used. Other durations in this roadmap are existing product timing or acceptance limits, not delivery estimates.

<a id="migration-map"></a>
## Migration map

The four originals are preserved in the sibling `noola-docs-baseline-2026-10-03/` directory with SHA-256 checksums. They are a noncanonical migration baseline, not a second editable specification. This table assigns every original numbered section a disposition. Section numbers here identify history only; active links use named anchors.

### Original PRODUCT-PLAN.md

| Original section | Disposition | Canonical destination | Reason |
|---|---|---|---|
| 1. Product Overview | Condense | [PRODUCT-PLAN.md](../PRODUCT-PLAN.md#purpose-and-users) | Keep product intent, users and jobs; remove repeated mission summaries. |
| 2. Problem Statement | Condense | [PRODUCT-PLAN.md](../PRODUCT-PLAN.md#purpose-and-users) | Keep product intent, users and jobs; remove repeated mission summaries. |
| 3. Product Goals | Condense | [PRODUCT-PLAN.md](../PRODUCT-PLAN.md#purpose-and-users) | Keep product intent, users and jobs; remove repeated mission summaries. |
| 4. Non-Goals | Condense | [PRODUCT-PLAN.md](../PRODUCT-PLAN.md#release-scope) | Preserve current/future boundaries; catalog owns row-level scope. |
| 5. Target Users | Condense | [PRODUCT-PLAN.md](../PRODUCT-PLAN.md#purpose-and-users) | Keep product intent, users and jobs; remove repeated mission summaries. |
| 6. User Needs / Jobs to Be Done | Condense | [PRODUCT-PLAN.md](../PRODUCT-PLAN.md#purpose-and-users) | Keep product intent, users and jobs; remove repeated mission summaries. |
| 7. Core User Journeys | Move | [reference/ACCEPTANCE.md](ACCEPTANCE.md#user-journeys) | Preserve all 18 numbered and four additional journeys; flatten repetitive labels. |
| 8. Product Capabilities | Move | [reference/REQUIREMENTS.md](REQUIREMENTS.md#capability-catalog) | Retain every catalog row; remove repetitive per-feature metadata. |
| 9. Functional Requirements | Move | [reference/REQUIREMENTS.md](REQUIREMENTS.md#functional-requirements) | Retain unique content; replace repeated summaries with canonical links. |
| 10. Business Rules | Move | [reference/PRODUCT-RULES.md](PRODUCT-RULES.md#business-rules) | Retain unique content; replace repeated summaries with canonical links. |
| 11. Roles and Permissions | Move | [reference/PRODUCT-RULES.md](PRODUCT-RULES.md#roles-and-permissions) | Retain unique content; replace repeated summaries with canonical links. |
| 12. Data / Information Concepts | Move | [reference/PRODUCT-RULES.md](PRODUCT-RULES.md#information-concepts) | Retain unique content; replace repeated summaries with canonical links. |
| 13. Notifications and Communication | Move | [reference/PRODUCT-RULES.md](PRODUCT-RULES.md#notifications) | Retain unique content; replace repeated summaries with canonical links. |
| 14. Search and Discovery | Merge | [reference/REQUIREMENTS.md](REQUIREMENTS.md#search-behavior) | Retain unique behavior and exclusions; replace duplicated catalog/AI-route descriptions with links. |
| 15. AI Capabilities | Merge | [reference/REQUIREMENTS.md](REQUIREMENTS.md#ai-capabilities) | Retain unique behavior and exclusions; replace duplicated catalog/AI-route descriptions with links. |
| 16. Integrations | Merge | [reference/REQUIREMENTS.md](REQUIREMENTS.md#integration-scope) | Retain unique behavior and exclusions; replace duplicated catalog/AI-route descriptions with links. |
| 17. Product Experience Principles | Move | [reference/PRODUCT-RULES.md](PRODUCT-RULES.md#experience-principles) | Retain unique content; replace repeated summaries with canonical links. |
| 18. Product Constraints | Move | [reference/PRODUCT-RULES.md](PRODUCT-RULES.md#operating-constraints) | Retain unique content; replace repeated summaries with canonical links. |
| 19. Assumptions | Move | [reference/PRODUCT-RULES.md](PRODUCT-RULES.md#assumptions) | Retain unique content; replace repeated summaries with canonical links. |
| 20. Success Metrics | Move | [reference/ACCEPTANCE.md](ACCEPTANCE.md#quality-and-evaluation) | Keep QLT/T/X evidence and pilot procedure; family mapping goes to TRACEABILITY. |
| 21. MVP Scope | Condense | [PRODUCT-PLAN.md](../PRODUCT-PLAN.md#release-scope) | Preserve current/future boundaries; catalog owns row-level scope. |
| 22. Post-MVP Capabilities | Condense | [PRODUCT-PLAN.md](../PRODUCT-PLAN.md#release-scope) | Preserve current/future boundaries; catalog owns row-level scope. |
| 23. Risks and Product Challenges | Move | [reference/PRODUCT-RULES.md](PRODUCT-RULES.md#risks-and-incidents) | Retain unique content; replace repeated summaries with canonical links. |
| 24. Decision status and remaining evidence | Merge | [reference/DECISIONS-AND-GATES.md](DECISIONS-AND-GATES.md#legacy-decision-index) | One alias index; policy lives in PRODUCT-RULES, rationale in ADRs, evidence in gates. |
| 25. Technical direction and phased detail | Merge | [TECH-STACK.md](../TECH-STACK.md#selection-inventory) | Infrastructure choices move to stack/ADRs/operations; obsolete document prohibition removed. |
| 26. Glossary | Move | [reference/PRODUCT-RULES.md](PRODUCT-RULES.md#glossary) | Retain unique content; replace repeated summaries with canonical links. |
| 27. Consolidation and change traceability | Replace | [reference/TRACEABILITY.md](TRACEABILITY.md#migration-map) | Retire conversion narrative and generic inspiration links; retain inventory and missing-history provenance. |

### Original ARCHITECTURE.md

| Original section | Disposition | Canonical destination | Reason |
|---|---|---|---|
| 1. Architecture Executive Summary | Condense | [ARCHITECTURE.md](../ARCHITECTURE.md#structure-and-boundaries) | Core summarizes structure; detailed controls link to references; correct diagrams. |
| 2. Architecture Goals | Condense | [ARCHITECTURE.md](../ARCHITECTURE.md#structure-and-boundaries) | Core summarizes structure; detailed controls link to references; correct diagrams. |
| 3. Architecture Drivers | Condense | [ARCHITECTURE.md](../ARCHITECTURE.md#structure-and-boundaries) | Core summarizes structure; detailed controls link to references; correct diagrams. |
| 4. Quality Attributes | Merge | [reference/APPLICATION-DESIGN.md](APPLICATION-DESIGN.md#quality-drivers) | Keep technical implications; numerical targets owned by ACCEPTANCE. |
| 5. Architecture Principles | Condense | [ARCHITECTURE.md](../ARCHITECTURE.md#structure-and-boundaries) | Core summarizes structure; detailed controls link to references; correct diagrams. |
| 6. Architecture Style | ADR | [adr/001-application-structure.md](../adr/001-application-structure.md#decision) | Extract application-style rationale and alternatives. |
| 7. System Context | Condense | [ARCHITECTURE.md](../ARCHITECTURE.md#structure-and-boundaries) | Core summarizes structure; detailed controls link to references; correct diagrams. |
| 8. Container Architecture | Condense | [ARCHITECTURE.md](../ARCHITECTURE.md#structure-and-boundaries) | Core summarizes structure; detailed controls link to references; correct diagrams. |
| 9. Internal Application Architecture | Move | [reference/APPLICATION-DESIGN.md](APPLICATION-DESIGN.md#module-contracts) | Retain unique content; replace repeated summaries with canonical links. |
| 10. Dependency Rules | Condense | [ARCHITECTURE.md](../ARCHITECTURE.md#structure-and-boundaries) | Core summarizes structure; detailed controls link to references; correct diagrams. |
| 11. Primary System Flows | Move | [reference/APPLICATION-DESIGN.md](APPLICATION-DESIGN.md#system-flows) | Retain unique content; replace repeated summaries with canonical links. |
| 12. Data Architecture | Move | [reference/DATA-AND-SECURITY.md](DATA-AND-SECURITY.md#data-architecture) | Keep enforcement contracts; retention values and permission policy link to PRODUCT-RULES. |
| 13. AI Architecture | Move | [reference/APPLICATION-DESIGN.md](APPLICATION-DESIGN.md#ai-orchestration) | Retain unique content; replace repeated summaries with canonical links. |
| 14. Authentication and Authorization Architecture | Move | [reference/DATA-AND-SECURITY.md](DATA-AND-SECURITY.md#identity-and-authorization) | Keep enforcement contracts; retention values and permission policy link to PRODUCT-RULES. |
| 15. Security Architecture | Move | [reference/DATA-AND-SECURITY.md](DATA-AND-SECURITY.md#security-controls) | Keep enforcement contracts; retention values and permission policy link to PRODUCT-RULES. |
| 16. Privacy Architecture | Move | [reference/DATA-AND-SECURITY.md](DATA-AND-SECURITY.md#privacy-controls) | Keep enforcement contracts; retention values and permission policy link to PRODUCT-RULES. |
| 17. API and Integration Architecture | Move | [reference/APPLICATION-DESIGN.md](APPLICATION-DESIGN.md#api-contracts) | Retain unique content; replace repeated summaries with canonical links. |
| 18. Realtime and Streaming Architecture | Move | [reference/APPLICATION-DESIGN.md](APPLICATION-DESIGN.md#progress-and-realtime) | Retain unique content; replace repeated summaries with canonical links. |
| 19. Asynchronous Processing | Move | [reference/APPLICATION-DESIGN.md](APPLICATION-DESIGN.md#durable-execution) | Retain unique content; replace repeated summaries with canonical links. |
| 20. Search and Retrieval Architecture | Move | [reference/APPLICATION-DESIGN.md](APPLICATION-DESIGN.md#retrieval) | Retain unique content; replace repeated summaries with canonical links. |
| 21. Caching Strategy | Move | [reference/APPLICATION-DESIGN.md](APPLICATION-DESIGN.md#caching) | Retain unique content; replace repeated summaries with canonical links. |
| 22. Observability Architecture | Move | [reference/OPERATIONS.md](OPERATIONS.md#observability) | Retain unique content; replace repeated summaries with canonical links. |
| 23. Error Handling and Resilience | Move | [reference/APPLICATION-DESIGN.md](APPLICATION-DESIGN.md#resilience) | Retain unique content; replace repeated summaries with canonical links. |
| 24. Deployment Architecture | Move | [reference/OPERATIONS.md](OPERATIONS.md#deployment) | Retain unique content; replace repeated summaries with canonical links. |
| 25. Environment Strategy | Move | [reference/OPERATIONS.md](OPERATIONS.md#environments) | Retain unique content; replace repeated summaries with canonical links. |
| 26. Scalability Strategy | Move | [reference/APPLICATION-DESIGN.md](APPLICATION-DESIGN.md#evolution-triggers) | Retain unique content; replace repeated summaries with canonical links. |
| 27. Architecture Evolution by Roadmap Phase | Merge | [ROADMAP.md](../ROADMAP.md#delivery-sequence) | Remove second phase narrative; phase references and introduction points remain in roadmap/stack. |
| 28. Architecture Decision Summary | ADR | [adr/README.md](../adr/README.md#decision-index) | Replace repeated decision summaries and backlog with ADR index; reserve 011/012. |
| 29. Decisions to record within each phase | ADR | [adr/README.md](../adr/README.md#decision-index) | Replace repeated decision summaries and backlog with ADR index; reserve 011/012. |
| 30. Architectural Risks | Merge | [reference/DECISIONS-AND-GATES.md](DECISIONS-AND-GATES.md#legacy-decision-index) | Consolidate risk and evidence gates without promoting approval or test status. |
| 31. Architecture decision status | Merge | [reference/DECISIONS-AND-GATES.md](DECISIONS-AND-GATES.md#legacy-decision-index) | Consolidate risk and evidence gates without promoting approval or test status. |
| 32. Derived Architecture Requirements | Move | [reference/APPLICATION-DESIGN.md](APPLICATION-DESIGN.md#derived-requirements) | Retain unique content; replace repeated summaries with canonical links. |
| 33. Architecture Constraints | Condense | [ARCHITECTURE.md](../ARCHITECTURE.md#structure-and-boundaries) | Core summarizes structure; detailed controls link to references; correct diagrams. |
| 34. Out-of-Scope Architecture | Condense | [ARCHITECTURE.md](../ARCHITECTURE.md#structure-and-boundaries) | Core summarizes structure; detailed controls link to references; correct diagrams. |
| 35. Architecture Traceability | Merge | [reference/TRACEABILITY.md](TRACEABILITY.md#requirement-matrix) | Join module/phase/acceptance mappings by requirement ID. |
| 36. Phase-specific detail | Replace | [README.md](../README.md#maintaining-the-documents) | Apply approved ownership model; phase-specific implementation detail stays just in time. |
| 37. Architecture Review Checklist | Remove | [reference/TRACEABILITY.md](TRACEABILITY.md#migration-map) | Remove self-certified coverage checklist; use executable documentation checks. |

### Original ROADMAP.md

| Original section | Disposition | Canonical destination | Reason |
|---|---|---|---|
| 1. Roadmap Purpose | Condense | [ROADMAP.md](../ROADMAP.md#delivery-sequence) | Keep sequence, outcomes, hard dependencies, exit gates and future boundaries; remove repeated descriptions. |
| 2. Roadmap Principles | Condense | [ROADMAP.md](../ROADMAP.md#delivery-sequence) | Keep sequence, outcomes, hard dependencies, exit gates and future boundaries; remove repeated descriptions. |
| 3. Product Delivery Strategy | Condense | [ROADMAP.md](../ROADMAP.md#delivery-sequence) | Keep sequence, outcomes, hard dependencies, exit gates and future boundaries; remove repeated descriptions. |
| 4. Roadmap Overview | Condense | [ROADMAP.md](../ROADMAP.md#delivery-sequence) | Keep sequence, outcomes, hard dependencies, exit gates and future boundaries; remove repeated descriptions. |
| 5. Dependency Overview | Condense | [ROADMAP.md](../ROADMAP.md#delivery-sequence) | Keep sequence, outcomes, hard dependencies, exit gates and future boundaries; remove repeated descriptions. |
| 6. Phase Details | Condense | [ROADMAP.md](../ROADMAP.md#delivery-sequence) | Keep sequence, outcomes, hard dependencies, exit gates and future boundaries; remove repeated descriptions. |
| 7. First Usable Product | Condense | [ROADMAP.md](../ROADMAP.md#delivery-sequence) | Keep sequence, outcomes, hard dependencies, exit gates and future boundaries; remove repeated descriptions. |
| 8. MVP Completion Point | Condense | [ROADMAP.md](../ROADMAP.md#delivery-sequence) | Keep sequence, outcomes, hard dependencies, exit gates and future boundaries; remove repeated descriptions. |
| 9. Post-MVP Roadmap | Condense | [ROADMAP.md](../ROADMAP.md#delivery-sequence) | Keep sequence, outcomes, hard dependencies, exit gates and future boundaries; remove repeated descriptions. |
| 10. Production Readiness | Move | [reference/ACCEPTANCE.md](ACCEPTANCE.md#production-readiness) | Keep earliest-protection and full-release gates. |
| 11. Deferred / Future Capabilities | Condense | [ROADMAP.md](../ROADMAP.md#delivery-sequence) | Keep sequence, outcomes, hard dependencies, exit gates and future boundaries; remove repeated descriptions. |
| 12. Cross-Phase Capabilities | Condense | [ROADMAP.md](../ROADMAP.md#delivery-sequence) | Keep sequence, outcomes, hard dependencies, exit gates and future boundaries; remove repeated descriptions. |
| 13. Risk and Validation Roadmap | Merge | [reference/DECISIONS-AND-GATES.md](DECISIONS-AND-GATES.md#legacy-decision-index) | Retain unique content; replace repeated summaries with canonical links. |
| 14. Roadmap decision status | Merge | [reference/DECISIONS-AND-GATES.md](DECISIONS-AND-GATES.md#legacy-decision-index) | Retain unique content; replace repeated summaries with canonical links. |
| 15. Feature-to-Phase Mapping | Merge | [reference/TRACEABILITY.md](TRACEABILITY.md#requirement-matrix) | One complete catalog mapping, plus cross-cutting mappings; fix stale policy statuses. |
| 16. Roadmap Completion Summary | Condense | [ROADMAP.md](../ROADMAP.md#delivery-sequence) | Keep sequence, outcomes, hard dependencies, exit gates and future boundaries; remove repeated descriptions. |
| 17. Roadmap Conversion Notes | Condense | [reference/TRACEABILITY.md](TRACEABILITY.md#sequencing-notes) | Keep dependency exceptions and scope cautions; retire conversion claims. |

### Original TECH-STACK.md

| Original section | Disposition | Canonical destination | Reason |
|---|---|---|---|
| 1. Executive Summary | Merge | [TECH-STACK.md](../TECH-STACK.md#selection-inventory) | One inventory; package names retained; rationale in ADRs, detailed constraints in references. |
| 2. Technology Selection Principles | Merge | [TECH-STACK.md](../TECH-STACK.md#selection-inventory) | One inventory; package names retained; rationale in ADRs, detailed constraints in references. |
| 3. Existing Technology Constraints | Merge | [TECH-STACK.md](../TECH-STACK.md#selection-inventory) | One inventory; package names retained; rationale in ADRs, detailed constraints in references. |
| 4. Core Application Stack | Merge | [TECH-STACK.md](../TECH-STACK.md#selection-inventory) | One inventory; package names retained; rationale in ADRs, detailed constraints in references. |
| 5. Frontend Stack | Merge | [TECH-STACK.md](../TECH-STACK.md#selection-inventory) | One inventory; package names retained; rationale in ADRs, detailed constraints in references. |
| 6. Backend Stack | Move | [reference/APPLICATION-DESIGN.md](APPLICATION-DESIGN.md#transport-and-validation) | Retain unique integration constraints, not duplicate policy or rationale. |
| 7. Data Stack | Merge | [TECH-STACK.md](../TECH-STACK.md#selection-inventory) | One inventory; package names retained; rationale in ADRs, detailed constraints in references. |
| 8. Authentication and Authorization | Move | [reference/DATA-AND-SECURITY.md](DATA-AND-SECURITY.md#authentication-integration) | Retain unique content; replace repeated summaries with canonical links. |
| 9. AI Stack | Move | [reference/APPLICATION-DESIGN.md](APPLICATION-DESIGN.md#provider-contracts) | Retain unique integration constraints, not duplicate policy or rationale. |
| 10. File and Media Stack | Move | [reference/APPLICATION-DESIGN.md](APPLICATION-DESIGN.md#capture-and-parsing) | Retain unique integration constraints, not duplicate policy or rationale. |
| 11. Async and Realtime Stack | Move | [reference/APPLICATION-DESIGN.md](APPLICATION-DESIGN.md#dispatch-integration) | Retain unique integration constraints, not duplicate policy or rationale. |
| 12. Communication Stack | Move | [reference/APPLICATION-DESIGN.md](APPLICATION-DESIGN.md#transactional-email) | Retain unique integration constraints, not duplicate policy or rationale. |
| 13. Observability Stack | Move | [reference/OPERATIONS.md](OPERATIONS.md#operational-instrumentation) | Retain unique content; replace repeated summaries with canonical links. |
| 14. Testing Stack | Move | [reference/ACCEPTANCE.md](ACCEPTANCE.md#verification-tooling) | Retain tool responsibilities and synthetic evaluation discipline; remove missing D21 link. |
| 15. Development Tooling | Merge | [TECH-STACK.md](../TECH-STACK.md#selection-inventory) | One inventory; package names retained; rationale in ADRs, detailed constraints in references. |
| 16. Repository / Monorepo Tooling | Merge | [TECH-STACK.md](../TECH-STACK.md#selection-inventory) | One inventory; package names retained; rationale in ADRs, detailed constraints in references. |
| 17. CI/CD Stack | Move | [reference/OPERATIONS.md](OPERATIONS.md#delivery-pipeline) | Retain unique content; replace repeated summaries with canonical links. |
| 18. Hosting and Infrastructure | Move | [reference/OPERATIONS.md](OPERATIONS.md#hosting-and-custody) | Retain unique content; replace repeated summaries with canonical links. |
| 19. Security Tooling | Move | [reference/DATA-AND-SECURITY.md](DATA-AND-SECURITY.md#security-tooling) | Retain unique content; replace repeated summaries with canonical links. |
| 20. Dependency Policy | Merge | [TECH-STACK.md](../TECH-STACK.md#selection-inventory) | One inventory; package names retained; rationale in ADRs, detailed constraints in references. |
| 21. Selected Stack Summary | Merge | [TECH-STACK.md](../TECH-STACK.md#selection-inventory) | One inventory; package names retained; rationale in ADRs, detailed constraints in references. |
| 22. Deferred Technologies | Move | [reference/TECHNOLOGY-EVIDENCE.md](TECHNOLOGY-EVIDENCE.md#deferred-technologies) | Label as inherited dated research, not newly verified or tested evidence. |
| 23. Technology Decision Details | ADR | [adr/README.md](../adr/README.md#decision-index) | Move meaningful alternatives, trade-offs, exit paths and reconsideration triggers to relevant ADRs. |
| 24. Compatibility Matrix | Move | [reference/TECHNOLOGY-EVIDENCE.md](TECHNOLOGY-EVIDENCE.md#compatibility-snapshot) | Label as inherited dated research, not newly verified or tested evidence. |
| 25. Version Strategy | Move | [reference/TECHNOLOGY-EVIDENCE.md](TECHNOLOGY-EVIDENCE.md#version-snapshot) | Label as inherited dated research, not newly verified or tested evidence. |
| 26. Licensing Review | Move | [reference/TECHNOLOGY-EVIDENCE.md](TECHNOLOGY-EVIDENCE.md#licensing-snapshot) | Label as inherited dated research, not newly verified or tested evidence. |
| 27. Cost Considerations | Move | [reference/OPERATIONS.md](OPERATIONS.md#cost-accounting) | Retain unique content; replace repeated summaries with canonical links. |
| 28. Vendor Lock-In Analysis | ADR | [adr/README.md](../adr/README.md#decision-index) | Move meaningful alternatives, trade-offs, exit paths and reconsideration triggers to relevant ADRs. |
| 29. Technology Risks | Move | [reference/TECHNOLOGY-EVIDENCE.md](TECHNOLOGY-EVIDENCE.md#technology-risks) | Label as inherited dated research, not newly verified or tested evidence. |
| 30. Technology decision status | Merge | [reference/DECISIONS-AND-GATES.md](DECISIONS-AND-GATES.md#legacy-decision-index) | Retain unique content; replace repeated summaries with canonical links. |
| 31. Decisions to record within each phase | Replace | [adr/README.md](../adr/README.md#decision-index) | Replace repeated decision topics with ADR links; remove obsolete no-ADR instruction. |
| 32. Roadmap Alignment | Merge | [ROADMAP.md](../ROADMAP.md#delivery-sequence) | Keep technology introduction once in stack inventory; remove duplicate phase timeline. |
| 33. Technology Introduction Timeline | Merge | [ROADMAP.md](../ROADMAP.md#delivery-sequence) | Keep technology introduction once in stack inventory; remove duplicate phase timeline. |
| 34. Explicit Non-Selections | ADR | [adr/README.md](../adr/README.md#decision-index) | Move meaningful alternatives, trade-offs, exit paths and reconsideration triggers to relevant ADRs. |
| 35. Recommended Initial Dependency Set | Merge | [TECH-STACK.md](../TECH-STACK.md#selection-inventory) | One inventory; package names retained; rationale in ADRs, detailed constraints in references. |
| 36. Final Review | Remove | [reference/DECISIONS-AND-GATES.md](DECISIONS-AND-GATES.md#evidence-gates) | Remove self-review and unsupported verified-cost claim; actual evidence remains pending. |

Additional extraction: stack frontend, data, package-name and testing constraints are incorporated into the corresponding application, security, evidence and acceptance references. Meaningful selection alternatives are retained in ADRs; package-level testing/tooling trade-offs remain in TECHNOLOGY-EVIDENCE. The unavailable D01–D29 register is not reconstructed.

## Consolidation validation

Documentation checks on 3 October 2026 passed for all 26 Markdown files: local links and named anchors, table structure, catalog classification, traceability, stable identifiers, legacy decision aliases, phase gates and ADR structure. The four core files total 6,210 words versus 81,199 before consolidation. All 205 original catalog rows, all 96 QLT/T/X rows, and all nine FR and thirteen BR blocks were compared with the baseline and preserved apart from relocated references. The 22 distinct digit-based quantities found in the originals remain represented; complete FR/BR fingerprints protect policy exceptions as well as numbers.

All four Mermaid diagrams rendered successfully with Mermaid CLI 12.0.0 in temporary tooling outside the repository. No application dependency or manifest was introduced for rendering. These are documentation migration results, not passing evidence for any product or infrastructure gate. External sources were not revalidated. The original-file checksums remain in the sibling baseline manifest and `scripts/docs-baseline.json`.

On 4 October 2026, Nishanth explicitly resolved ISSUE-01 and ISSUE-02. The current product rules, requirement summary, technical contracts, ADR references, acceptance journey and X20 now reflect the all-route AI pause at paid-budget exhaustion and the nonproduction residency/no-training/processor-retention qualification exemptions. Only the protected BR-007 block and acceptance-table fingerprint were refreshed for these approved amendments; the original source checksums, catalog classification, FR blocks and other BR blocks remain the historical baseline. Runtime, device, provider, production privacy and household evidence remain pending.
