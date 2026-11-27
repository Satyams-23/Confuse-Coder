# Data Engineer Roadmap 2026
*@confuse__coder.dev · CAREER ROADMAP 01 · Reel: Seedhe Spark se shuru kiya? Order galat hai*

---

## 1. Data Engineer actually karta kya hai
Data Engineer company ka data ek jagah laata hai, saaf karta hai, aur aise rakhta hai ki Analyst, Scientist aur AI team usse bina toote use kar sakein.

Ek normal din:
- Subah check: raat wali pipeline chali ya fail hui? (Airflow / Databricks Jobs)
- Naya source jodna: app ka Postgres, ek payment API, ya Kafka se live events
- SQL / PySpark mein transformation likhna: duplicates hatana, joins, daily summary tables
- Warehouse (Snowflake / BigQuery / Redshift) mein tables design karna
- Data quality checks: aaj ka count kal se 90% kam kyun hai?

| Role | Main kaam | Output |
|---|---|---|
| Data Engineer | Data laana, saaf karna, pipeline chalana | Reliable tables + pipelines |
| Data Analyst | Data se sawaal ka jawab | Dashboards, reports |
| Data Scientist | Data se prediction / model | Models, experiments |

Simple line: **Analyst aur Scientist data use karte hain, Data Engineer unke liye data ka road banata hai.**

## 2. Pay aur demand
Sab numbers 27 Nov 2026 ko check kiye.

**India** (source: AmbitionBox, "Data Engineer salaries in India", 1.2 lakh salaries, updated 26 Nov 2026):

| Experience | Range (per year) |
|---|---|
| Fresher (0 yr) | ~₹4–8 LPA services, ₹8–15 LPA product (estimate*) |
| 1–3 years | ₹7.5 – 8.3 LPA |
| 3–6 years | ₹11.3 – 12.5 LPA |
| 6–9 years | ₹17.5 – 19.4 LPA |

\*AmbitionBox fresher band alag nahi deta. Ye range un salary blogs ki hai jo usi data ko quote karte hain, isko estimate samjho.

Company type se bada farak: IT services ₹9.3–10.2 LPA, software product ₹14.3–15.8 LPA, financial services ₹17–18.8 LPA (same source).

**US** base pay:
- Glassdoor range: **$94K – $146K** per year
- Real posting: Amazon *Data Engineer I* (Bellevue, posted 23 Nov 2026): **$101,300 – $160,000**

**Demand:** InterviewStack.io job board pe May 2026 mein 6,877 active Data Engineer postings the (US 29%, India 23%). Sirf **3% entry-level** title wale. Matlab freshers aksar *Associate / Trainee / Analyst* role se andar aate hain aur kaam seekhte-seekhte DE bante hain. Isliye projects aur SQL strong hona zaroori hai.

## 3. Roadmap ek nazar mein
10 steps, isi order mein. Apni speed se chalo: koi deadline nahi, ek step pakka hone ke baad hi agla.

| Step | Topics |
|---|---|
| 1. Programming fundamentals | Python, OOP, Git, Linux, Bash |
| 2. SQL & databases | Joins, CTEs, window functions, indexing, PostgreSQL |
| 3. Data modelling | OLTP vs OLAP, star schema, snowflake schema, normalisation, SCD |
| 4. Data warehousing & ETL | ETL vs ELT, data lakes, data warehouses, data pipelines |
| 5. Data transformation | dbt, incremental models, testing, documentation |
| 6. Big data processing | Apache Spark, PySpark, Spark SQL, partitioning |
| 7. Workflow orchestration | Apache Airflow, DAGs, scheduling, monitoring |
| 8. Streaming | Apache Kafka, producers, consumers, event streaming |
| 9. Cloud & modern data platforms | AWS S3, IAM, Glue, Redshift, Snowflake, Databricks, Delta / Iceberg |
| 10. Deployment & production | Docker, CI/CD, logging, monitoring, data quality |

Saath-saath: har step ke baad uska mini project, aur **3 portfolio projects** (section 7). Interview prep (section 10) tab shuru karo jab steps 1–6 ho jaayein.

Rule: **SQL aur Python pe sabse zyada dhyan.** JD data mein ye dono 71% postings mein hain, Spark 33% mein. Tools badalte rehte hain, SQL nahi.

## 4. Step by step
Har step ke andar topics. Har topic mein same fields: kya seekhna, kyun, kitna deep, kahan se (video, docs, repo), practice, mini project aur outcome.

### Step 1 · Programming fundamentals

#### Linux, Git aur command line
- **Kya seekhna:** `ls cd cp mv grep find`, pipes `|`, file permissions, env vars, `ssh`, cron. Git: commit, branch, merge, pull request, `.gitignore`.
- **Kyun:** Servers Linux pe chalte hain, aur har pipeline Git se deploy hoti hai.
- **Kitna deep:** Roz ke commands bina Google kiye. Shell scripting basic.
- **Video:** Kunal Kushwaha, Git & GitHub full course (YouTube @KunalKushwaha)
- **Docs / free course:** [MIT Missing Semester](https://missing.csail.mit.edu/), [Learn Git Branching](https://learngitbranching.js.org/)
- **Practice:** Ek folder ki saari `.csv` files ki line count ek command mein nikalo (`wc -l *.csv`).
- **Mini project:** Bash script jo roz ek public CSV download kare, date wale folder mein save kare, cron se chale.
- **Outcome:** Terminal se dar khatam, har project GitHub pe.

#### Python for data
- **Kya seekhna:** Data types, list/dict, functions, files (CSV, JSON), error handling (`try/except`), virtual env, `requests` se API call, **pandas** (read, filter, groupby, merge), basic OOP, logging.
- **Kyun:** Pipelines, Airflow DAGs, PySpark sab Python mein likhe jaate hain.
- **Kitna deep:** Gande data ko handle karna aana chahiye (missing values, galat dates, broken rows). Web dev Python nahi chahiye.
- **Video:** Corey Schafer (Python + pandas series, @coreyms), codebasics (pandas, @codebasics)
- **Docs:** [Python tutorial](https://docs.python.org/3/tutorial/), [pandas docs](https://pandas.pydata.org/docs/), [Kaggle Learn: Pandas](https://www.kaggle.com/learn/pandas)
- **Practice:** Ek API se JSON lo, flatten karo, CSV mein likho. Ek 1 GB CSV ko `chunksize` se padho.
- **Mini project:** Weather API se 30 shehron ka data roz fetch karke Postgres mein insert karo (bad rows ek alag file mein).
- **Outcome:** Koi bhi file/API ka data Python se saaf karke kahin bhi likh sako.

### Step 2 · SQL & databases

#### SQL (sabse important)
- **Kya seekhna:**
  1. Basics: `SELECT WHERE GROUP BY HAVING ORDER BY`, joins (inner, left, self), `CASE`
  2. Intermediate: subqueries, CTE (`WITH`), `UNION`, date functions, NULL handling
  3. Advanced: **window functions** (`ROW_NUMBER RANK LAG LEAD SUM() OVER`), dedupe, running totals, gaps & islands
  4. Performance: indexes, `EXPLAIN`, partitioning, why `SELECT *` is costly
  5. DDL / DML: `CREATE`, `INSERT`, `MERGE` / upsert, transactions
- **Kyun:** Har DE interview ka pehla round SQL hota hai. Amazon jaisi companies mein 2 rounds tak.
- **Kitna deep:** Window functions aur dedupe queries 10 minute mein likh pao. `EXPLAIN` padh pao.
- **Video:** Ankit Bansal (interview SQL, @ankitbansal6), techTFQ (@techTFQ), Data with Baraa (full SQL course, @DataWithBaraa)
- **Docs:** [PostgreSQL docs](https://www.postgresql.org/docs/current/)
- **Practice:** [SQLBolt](https://sqlbolt.com/) (start), [PG Exercises](https://pgexercises.com/), [LeetCode SQL 50](https://leetcode.com/studyplan/top-sql-50/), [DataLemur](https://datalemur.com/), [StrataScratch](https://www.stratascratch.com/)
- **Mini project:** Local Postgres mein ek e-commerce schema (users, orders, products) banao aur 20 business sawaalon ki queries likho: monthly revenue, repeat customers, top product har category mein.
- **Outcome:** Koi bhi business sawaal SQL mein. Interview SQL round clear.

### Step 3 · Data modelling

#### Data modelling
- **Kya seekhna:** OLTP vs OLAP, normalisation (1NF–3NF), **star schema** (fact + dimension tables), snowflake schema, **SCD Type 1 / 2** (slowly changing dimensions), grain, surrogate keys.
- **Kyun:** Pipeline sahi ho par table design galat ho, to har query slow aur confusing hogi. Interviews mein "is business ke liye schema design karo" common hai.
- **Kitna deep:** Kisi bhi business (Swiggy, bank) ka star schema whiteboard pe bana pao. SCD2 ka SQL likh pao.
- **Video:** Data with Baraa, *SQL Data Warehouse project* (@DataWithBaraa)
- **Book:** Kimball, [*The Data Warehouse Toolkit*](https://www.kimballgroup.com/data-warehouse-business-intelligence-resources/books/data-warehouse-dw-toolkit/) (paid, classic)
- **Practice:** Ola/Uber ka star schema banao: fact = rides, dims = driver, rider, city, date.
- **Mini project:** E-commerce Postgres data ko star schema mein convert karo + customer address ke liye SCD2.
- **Outcome:** Tables design kar sako jo saal bhar baad bhi samajh aayein.

### Step 4 · Data warehousing & ETL

#### ETL / ELT aur pipelines
- **Kya seekhna:** ETL vs ELT, batch vs incremental load, **idempotency** (pipeline do baar chale to bhi data double na ho), upsert / `MERGE`, CDC ka idea. Data warehouse vs data lake vs lakehouse, aur ek pipeline ke stages: ingest → store → transform → serve.
- **Kyun:** Har Data Engineer ka asli kaam pipeline hai. Data pipelines 74% JDs mein hain, sabse upar.
- **Kitna deep:** Ek pipeline whiteboard pe bana pao aur bata pao ki fail hone pe dobara chalane se data double kyun nahi hoga.
- **Video:** Seattle Data Guy (@SeattleDataGuy), DataTalksClub Zoomcamp Module 1–2
- **Docs / book:** [*Fundamentals of Data Engineering*](https://www.oreilly.com/library/view/fundamentals-of-data/9781098108298/) (Reis & Housley), chapters on the data engineering lifecycle
- **Practice:** Python + Postgres wala pipeline do baar chalao. Duplicate bane? `MERGE` / delete-insert se idempotent banao.
- **Mini project:** CSV files → raw table → clean table → summary table, har step ek alag SQL script.
- **Outcome:** ETL/ELT, lake/warehouse aur idempotency interview mein confidently samjha pao.

### Step 5 · Data transformation

#### dbt
- **Kya seekhna:** **dbt:** models, `ref()`, sources, tests (`unique`, `not_null`), docs, **incremental models**, seeds, snapshots.
- **Kyun:** Aaj kal zyada teams data pehle warehouse mein load karti hain aur SQL (dbt) se transform karti hain. dbt 24% JDs mein hai.
- **Kitna deep:** Ek incremental dbt model + tests (`unique`, `not_null`) likh pao.
- **Free course:** [dbt Learn](https://www.getdbt.com/dbt-learn) (dbt Fundamentals free) + [dbt guides](https://docs.getdbt.com/guides)
- **Docs:** [docs.getdbt.com](https://docs.getdbt.com/)
- **Repo:** [dbt-labs/jaffle-shop](https://github.com/dbt-labs/jaffle-shop) (official demo project)
- **Practice:** Jaffle Shop clone karo, ek naya model `customer_lifetime_value` add karo with tests.
- **Mini project:** Raw CSVs → Postgres/DuckDB → dbt staging → marts (star schema) → dbt docs site.
- **Outcome:** Modern data stack ka transform layer khud bana sako.

### Step 6 · Big data processing

#### Apache Spark / PySpark
- **Kya seekhna:** Kyun distributed? Driver/executor, partitions, lazy evaluation, transformations vs actions, DataFrame API, Spark SQL, joins aur **shuffle**, broadcast join, caching, file formats (**Parquet**), skew handling, Spark UI padhna.
- **Kyun:** Jab data ek machine mein na aaye. Spark 33% + Databricks 29% JDs mein.
- **Kitna deep:** PySpark DataFrame se ETL likh pao, aur bata pao ki job slow kyun hai (shuffle, skew, small files).
- **Video:** Darshil Parmar (@DarshilParmar), Sumit Mittal (@sumitmittal07), DataTalksClub Zoomcamp Module 6
- **Docs:** [spark.apache.org/docs](https://spark.apache.org/docs/latest/)
- **Repo:** [databricks/LearningSparkV2](https://github.com/databricks/LearningSparkV2) (book *Learning Spark* ke examples)
- **Practice:** NYC Taxi data (Zoomcamp mein milta hai) pe: hourly trips, top zones, avg fare. Same query Parquet vs CSV mein time karo.
- **Mini project:** 10M+ rows PySpark se clean karke partitioned Parquet (year/month) mein likho.
- **Outcome:** Big data pe confident, Spark interview questions ka jawab.

### Step 7 · Workflow orchestration

#### Apache Airflow
- **Kya seekhna:** DAG, tasks, operators, scheduling (cron), dependencies, retries, backfill, XCom, sensors, connections/variables, TaskFlow API.
- **Kyun:** Pipelines ko roz time pe, sahi order mein, fail hone pe retry ke saath chalana. India mein abhi bhi default orchestrator. 29% JDs.
- **Kitna deep:** Ek daily DAG likh pao jo extract → load → dbt run kare, retries aur alert ke saath.
- **Free course:** [Astronomer Academy](https://academy.astronomer.io/)
- **Docs:** [airflow.apache.org/docs](https://airflow.apache.org/docs/)
- **Practice:** Weather wala script DAG bana do, `catchup` aur backfill try karo.
- **Mini project:** Docker Compose pe Airflow + Postgres; DAG roz API data laaye aur dbt chalaye.
- **Outcome:** Pipelines production jaisa schedule aur monitor kar sako.

### Step 8 · Streaming

#### Apache Kafka
- **Kya seekhna:** Topic, partition, offset, producer, consumer, consumer group, retention, at-least-once vs exactly-once, Kafka Connect ka idea, Spark Structured Streaming se padhna.
- **Kyun:** Live data (orders, clicks, payments) ke liye. 17% JDs, par senior roles mein zyada.
- **Kitna deep:** Producer/consumer Python mein likh pao, partitions aur consumer groups samjha pao.
- **Free course:** [Confluent Developer courses](https://developer.confluent.io/courses/)
- **Docs:** [kafka.apache.org/documentation](https://kafka.apache.org/documentation/)
- **Practice:** Docker mein Kafka chalao, fake orders produce karo, 2 consumers ek group mein chalake dekho partitions kaise bat-te hain.
- **Mini project:** Fake click events → Kafka → Python consumer → Postgres mein per-minute counts.
- **Outcome:** Batch aur streaming dono samajh aayein.

### Step 9 · Cloud & modern data platforms

#### Ek cloud (AWS first)
- **Kya seekhna (AWS):** S3, IAM (roles, policies), Glue (catalog + jobs), Athena, Redshift, EMR, Lambda, Kinesis basics. Billing alerts pehle din lagao.
- **Kyun:** 63% JDs koi cloud maangte hain. AWS 44%, Azure 33%, GCP 25%. Ek cloud deep, baaki ka naam-mapping kaafi hai.
- **Azure / GCP mapping:** S3 = ADLS / GCS · Glue = Data Factory / Dataflow · Redshift = Synapse-Fabric / BigQuery · Kinesis = Event Hubs / Pub/Sub
- **Kitna deep:** S3 → Glue → Athena pipeline khud bana pao, IAM error khud solve kar pao.
- **Free:** [AWS Skill Builder](https://skillbuilder.aws/), [AWS Glue docs](https://docs.aws.amazon.com/glue/)
- **Certification (optional, paid):** [AWS Certified Data Engineer – Associate](https://aws.amazon.com/certification/certified-data-engineer-associate/) ya Azure ke liye [Microsoft Fabric Data Engineer (DP-700)](https://learn.microsoft.com/en-us/credentials/certifications/fabric-data-engineer-associate/)
- **Practice:** S3 mein CSV daalo, Glue crawler chalao, Athena se query karo.
- **Mini project:** Lambda roz API data S3 mein daale, Athena table pe query.
- **Outcome:** Resume pe "AWS" likh sako aur interview mein defend kar sako.

#### Snowflake, Databricks aur lakehouse
- **Kya seekhna:** Snowflake: warehouses (compute), stages, `COPY INTO`, time travel. Databricks: notebooks, clusters, jobs, Unity Catalog. Lakehouse table formats: **Delta Lake** aur **Apache Iceberg** (ACID on files, time travel, schema evolution).
- **Kyun:** Snowflake 31%, Databricks 29% JDs mein. Dono ke free trials hain.
- **Kitna deep:** Ek platform pe end-to-end pipeline chala pao. Dusre ka concept clear.
- **Free:** [Databricks free training](https://www.databricks.com/learn/training), [Snowflake docs](https://docs.snowflake.com/), [Databricks docs](https://docs.databricks.com/), [delta.io](https://delta.io/), [iceberg.apache.org](https://iceberg.apache.org/)
- **Certification (optional):** [Databricks Certified Data Engineer Associate](https://www.databricks.com/learn/certification/data-engineer-associate)
- **Practice:** Databricks Free Edition pe NYC Taxi data Delta table banao, `MERGE` aur time travel try karo.
- **Mini project:** Bronze → Silver → Gold (medallion) tables Databricks ya Snowflake pe.
- **Outcome:** Modern warehouse/lakehouse pe kaam ka experience.

### Step 10 · Deployment & production

#### Docker aur CI/CD
- **Kya seekhna:** Image, container, Dockerfile, `docker compose`, volumes. GitHub Actions se tests aur lint har push pe.
- **Kyun:** Har project "mere laptop pe chalta hai" se bahar nikle. CI/CD 30% JDs.
- **Docs:** [Docker get started](https://docs.docker.com/get-started/)
- **Practice:** Apne Python ETL ka Dockerfile banao.
- **Mini project:** Poora Airflow + Postgres + dbt project `docker compose up` se chale, GitHub Actions pe dbt tests chalein.
- **Outcome:** Koi bhi recruiter ek command mein tumhara project chala sake.

#### Data quality aur monitoring
- **Kya seekhna:** Row count checks, null/unique checks, freshness, schema change detection, alerting (Slack/email), lineage ka idea. Tools: dbt tests, Great Expectations.
- **Kyun:** Data Quality 43% JDs mein. Galat data chup-chap dashboard pe jaaye, ye sabse bura bug hai.
- **Docs:** [Great Expectations docs](https://docs.greatexpectations.io/)
- **Practice:** Apne pipeline mein 5 checks add karo, ek ko jaan-boojh ke fail karke alert dekho.
- **Outcome:** Pipeline sirf chalti nahi, trust bhi hoti hai.

### Poora course ek jagah
- [**DataTalksClub Data Engineering Zoomcamp**](https://github.com/DataTalksClub/data-engineering-zoomcamp): free, 47k+ GitHub stars. Docker, Terraform, GCP, BigQuery, dbt, Spark, Kafka, homework aur final project. Self-paced kabhi bhi, live cohort January mein.
- [**Data Engineer Handbook**](https://github.com/DataExpert-io/data-engineer-handbook) (Zach Wilson): 45k+ stars, books, communities, newsletters, free bootcamp links.
- [awesome-data-engineering](https://github.com/igorbarinov/awesome-data-engineering): tools ki badi list, jab kisi tool ka alternative dhoondhna ho.
- Paid, structured: [IBM Data Engineering Professional Certificate](https://www.coursera.org/professional-certificates/ibm-data-engineer) (Coursera). Book: [*Fundamentals of Data Engineering*](https://www.oreilly.com/library/view/fundamentals-of-data/9781098108298/) (Reis & Housley).
- Career + industry talk: Seattle Data Guy (@SeattleDataGuy), DataExpert / Zach Wilson (@EcZachly_).

## 5. Kaise padhna hai
**Har topic ka study loop (apni speed se):**
1. Concept: video ya docs se idea samjho.
2. Code: khud type karke chalao. Copy-paste nahi.
3. Build: us topic ka mini project.
4. Practice: kuch SQL problems + topic ki notes 1 page mein.
5. Revise: agle topic se pehle ek baar dohrao. Atke ho to aage mat bhaago.

**Order kyun ye hai:** SQL + Python ke bina Spark/dbt/Airflow sirf tool chalana hai. Pehle foundation, phir tools, aur har tool ke baad usko pichhle project mein jodo. Ek hi project har phase mein bada hota jaaye, ye best hai.

**Mushkil topics kaise:**
- **Spark internals:** Spark UI kholo aur ek join ka shuffle stage dekho. Partitions change karke time note karo. Padhne se zyada dekhne se samajh aata hai.
- **Kafka partitions:** 1 producer, 3 partitions, 2 consumers, terminal mein log print karo kaun kya padh raha hai.
- **Window functions:** Pehle result table haath se kagaz pe banao, phir query.
- **SCD2:** Excel mein 3 rows ke saath haath se history banao, phir SQL.

**Kya skip karo (abhi):** Hadoop MapReduce deep, Scala (jab tak JD na maange), Kubernetes deep, har naya tool. Ek orchestrator, ek cloud, ek warehouse kaafi hai.

## 6. Practice bank
**SQL (rozana):**
1. LeetCode SQL 50 poora
2. DataLemur free questions (FAANG style)
3. StrataScratch (company-wise questions)
4. Ankit Bansal ki interview SQL playlist ke saath khud solve karo, phir video dekho

**Must-do SQL patterns:** second highest salary, dedupe with `ROW_NUMBER`, running total, month-over-month growth with `LAG`, consecutive days login (gaps & islands), top N per group, pivot with `CASE`, users jo A kiya par B nahi (anti join).

**PySpark exercises:**
1. CSV → DataFrame → schema fix → Parquet
2. groupBy + window function (top 3 per category)
3. Broadcast join vs normal join, time compare
4. Skewed key ko salting se fix karo

**Assignments (khud ke liye):**
- Ek pipeline jo do baar chale to bhi duplicate na bane (idempotent)
- Ek dbt model incremental banao aur full-refresh se compare karo
- Ek Airflow DAG jo 7 din ka backfill kare

## 7. Projects (GitHub portfolio)
Har project mein: README with architecture diagram, setup ek command, sample data, aur "maine kya seekha".

**Beginner: API to Postgres ETL**
- Stack: Python, requests, pandas, Postgres, cron, Docker
- Kya: Public API (weather / crypto price / cricket) se roz data, clean, Postgres mein upsert
- Proves: Python, SQL, idempotent loads

**Intermediate: Batch analytics pipeline**
- Stack: Airflow, dbt, Postgres / DuckDB ya Snowflake trial, Docker Compose, GitHub Actions
- Kya: Raw e-commerce / NYC Taxi data → staging → star schema marts → simple dashboard (Metabase / Streamlit)
- Proves: Modelling, orchestration, testing, modern data stack

**Advanced: Streaming lakehouse**
- Stack: Kafka, Spark Structured Streaming, Delta Lake / Iceberg, S3 (ya MinIO), Airflow, Terraform (optional)
- Kya: Fake orders/clicks Kafka mein → Spark stream → Bronze/Silver/Gold tables → live metrics dashboard + data quality alerts
- Proves: Streaming, big data, cloud, production thinking

**Bonus idea:** Zoomcamp ka final project karo aur peer review lo. Real dataset (Indian govt open data, IPL ball-by-ball) unique banata hai.

## 8. Tools ki list
| Area | Must-have (fresher) | Good-to-have (2+ yrs) |
|---|---|---|
| Languages | SQL, Python | Scala, Java |
| Processing | pandas, PySpark | Flink, Spark tuning |
| Orchestration | Airflow | Dagster, Prefect |
| Transform | dbt | dbt advanced macros |
| Warehouse | Postgres + 1 of Snowflake / BigQuery / Redshift | Multiple |
| Lakehouse | Parquet, Delta basics | Iceberg, Unity Catalog |
| Streaming | Kafka basics | Kafka Connect, CDC (Debezium) |
| Cloud | AWS (S3, Glue, Athena, IAM) | Azure / GCP, Terraform |
| DevOps | Git, Docker, GitHub Actions | Kubernetes |
| Quality | dbt tests | Great Expectations, observability tools |

## 9. Companies actually kya maangti hain
6,877 Data Engineer postings ka analysis (InterviewStack.io job board, May 2026, US 29% + India 23%):

| Skill | % of postings |
|---|---|
| Data pipelines / ETL | 74% |
| SQL | 71% |
| Python | 71% |
| AWS | 44% |
| Data quality | 43% |
| Data modelling | 38% |
| Azure | 33% |
| Spark | 33% |
| Snowflake | 31% |
| CI/CD | 30% |
| Databricks | 29% |
| Airflow | 29% |
| dbt | 24% |
| Kafka | 17% |
| Docker / Terraform | 14% each |

**Real JDs (Nov 2026):**
- **Amazon Data Engineer I** (US, 23 Nov 2026): 1+ yr DE, data modelling + warehousing + ETL, SQL, Python, AWS (Redshift, S3, Glue, EMR, Kinesis, Lambda, IAM). Preferred: Spark, Hive.
- **Walmart Staff Data Engineer** (US, 13 Nov 2026): Spark, Kafka, deep SQL, GCP (BigQuery, Dataflow, Pub/Sub), Airflow, 3+ yrs.
- **India fresher / early-career DE listings:** strong SQL + Python + DSA, PySpark, data modelling basics, aur **GitHub pe pipeline projects**.

**Fresher ke liye matlab:** SQL + Python + 1 cloud + Spark basics + 2–3 end-to-end projects. **Experienced ke liye:** system design, cost/performance tuning, streaming, data quality aur ownership.

## 10. Interview preparation
**Round pattern (common):** SQL coding → Python/PySpark coding → concepts → pipeline/system design → behavioural/project deep dive.

**Concept questions (short answers yaad rakho):**
1. *ETL vs ELT?* ETL mein transform load se pehle, ELT mein warehouse ke andar (dbt).
2. *Star vs snowflake schema?* Star mein dims flat (fast queries), snowflake mein dims normalised.
3. *SCD Type 1 vs 2?* Type 1 overwrite, Type 2 nayi row + `valid_from / valid_to` se history.
4. *Idempotent pipeline kya?* Kitni baar bhi chalao, result same. `MERGE` / delete-insert by partition.
5. *Partitioning vs bucketing?* Partition = folder by column (date), bucket = fixed files by hash.
6. *Spark mein shuffle kab hota hai?* `groupBy`, `join`, `distinct`, `repartition` pe. Mehnga hai.
7. *Broadcast join kab?* Ek table chhoti (MBs) ho to har executor ko bhej do, shuffle bacha lo.
8. *Data skew fix?* Salting, broadcast, AQE (adaptive query execution).
9. *Parquet kyun?* Columnar, compressed, sirf zaroori columns padhta hai.
10. *Kafka mein order guarantee?* Sirf ek partition ke andar.
11. *CDC kya hai?* Source DB ke changes (insert/update/delete) log se pakad ke aage bhejna.
12. *Data lake vs warehouse vs lakehouse?* Lake = raw files sasta, warehouse = structured fast SQL, lakehouse = files pe warehouse jaisa ACID (Delta/Iceberg).

**SQL coding (expect 2–4):** top N per group, MoM growth, consecutive days, dedupe latest record, median, cumulative sum.

**Python coding:** dict/list problems (easy–medium DSA), file parse karke aggregate, JSON flatten.

**Scenario questions:**
- "Raat 3 baje pipeline fail hui, subah dashboard khaali. Kya karoge?" → logs, retry, root cause, backfill, alert, post-mortem, test add.
- "Aaj ka data kal se 90% kam aaya." → source check, freshness, schema change, partial load, quality check pehle hona chahiye tha.
- "Spark job 10 min se 2 ghante ho gaya." → Spark UI, skew, small files, shuffle partitions, data growth.
- "Swiggy ke orders ka daily revenue dashboard design karo." → sources, batch vs stream, star schema, orchestration, quality, cost.
- "Ek column source ne rename kar diya." → schema contracts, alerting, versioned models.

**Resources:** DataLemur + StrataScratch (SQL), Zoomcamp homework (concepts), *Fundamentals of Data Engineering* (design).

## 11. Career preparation
**Resume (1 page):**
- Top: Skills line exactly JD ke words mein (SQL, Python, PySpark, Airflow, dbt, AWS S3/Glue, Snowflake).
- Projects > courses. Har bullet: *kya banaya + tool + number*. Example: "Built Airflow + dbt pipeline loading 2M NYC taxi rows daily into a star schema; 12 dbt tests catch bad loads."
- Certifications sirf agar real ho (AWS DE Associate / Databricks Associate).

**GitHub:**
- 3 pinned projects (beginner, intermediate, advanced), har ek mein architecture image + `docker compose up`.
- Profile README: ek line "Data Engineer: SQL, PySpark, Airflow, dbt, AWS".
- Commits regular, `.env` kabhi push nahi.

**LinkedIn:**
- Headline: "Aspiring Data Engineer | SQL · Python · PySpark · Airflow · AWS"
- About: 3 lines: kya banate ho, kaunse tools, ek project ka result.
- Har project ka chhota post (architecture diagram + 3 learnings). Recruiters "Data Engineer" + skills search karte hain.

**Apply kaise:**
- Entry-level DE kam hain (3%), isliye ye titles bhi search karo: *Associate Data Engineer, Data Engineer Trainee, Big Data Engineer, ETL Developer, Analytics Engineer, Data Analyst (SQL heavy)*.
- Service companies ke Data/Cloud practices (TCS, Infosys, Accenture, Deloitte, Fractal) freshers lete hain, phir internally DE.
- Official career pages + LinkedIn Jobs (last 24h filter) + referrals. Har application pe resume ke skills JD se match karo.
- Daily: 5 targeted applications > 50 random.

## 12. One-page checklist
- [ ] Linux + Git: daily commands, sab projects GitHub pe
- [ ] Python: API → clean → DB script
- [ ] SQL: LeetCode SQL 50 done, window functions comfortable
- [ ] Star schema + SCD2 bana sakte ho
- [ ] dbt project with tests
- [ ] PySpark ETL on 10M+ rows, Spark UI padh sakte ho
- [ ] Airflow DAG with retries + backfill
- [ ] Kafka producer/consumer
- [ ] AWS: S3 + Glue + Athena pipeline
- [ ] Snowflake ya Databricks pe medallion tables
- [ ] Docker Compose + GitHub Actions
- [ ] 3 portfolio projects with READMEs
- [ ] 100+ SQL problems, 12 concept answers ready
- [ ] Resume, GitHub, LinkedIn updated
- [ ] 5 targeted applications per day

Agla roadmap: Data Analyst. Follow karo [@confuse__coder.dev](https://www.instagram.com/confuse__coder.dev/).
