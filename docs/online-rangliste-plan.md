# Online-Rangliste, kostenlos

Plan für eine gemeinsame Rangliste von Blizzwar. Nur Rufname und Punktestand, kein Konto, keine personenbezogenen Zusatzdaten. Diese Datei beschreibt die Optionen. Sie legt keinen Dienst an und ändert kein Vercel-Projekt. Live geht die Liste erst, wenn Uwe sie freigibt.

Die lokale Rangliste im Action-Spiel bleibt die Quelle, bis eine dieser Optionen umgesetzt ist. Der Client kann Punkte fälschen, weil das Spiel im Browser läuft. Die Serverprüfung hält Spam klein, sie beweist den Flug nicht.

## Gemeinsame Grenzen

Vercel Hobby ist für persönliche, nicht kommerzielle Projekte und kostet 0 €, solange die Freimengen reichen. Werden sie überschritten, pausiert die betroffene Funktion in der Regel, statt still auf einen Bezahlplan zu wechseln. Eine bezahlte Erweiterung ist hier nicht vorgesehen.

Stand der öffentlichen Tarifseiten (Hobby, Upstash Redis Free, Neon Free, Global Config):

| Baustein | Preis bei Freimenge | Relevante Grenze |
| --- | --- | --- |
| Vercel Hobby, Functions | 0 € | 1 Mio. Aufrufe, 4 CPU-Stunden, 360 GB-Stunden Speicherzeit pro Monat; Laufzeit bis 300 s |
| Vercel Hobby, Transfer | 0 € | 100 GB Fast Data Transfer, 1 Mio. CDN-Anfragen |
| Upstash Redis, Free | 0 €, keine Karte | 1 Datenbank, 250 MB, 500.000 Befehle, 10 GB Traffic, 10.000 Befehle/s |
| Neon, Free | 0 € | 100 CU-Stunden und 1 GB Speicher je Projekt, 5 GB Transfer |
| Global Config (früher Edge Config) | 0 € in Hobby | 100.000 Lesezugriffe, nur 100 Schreibzugriffe pro Monat |

Eine Rangliste mit einigen hundert Einträgen und gelegentlichen Abrufen bleibt in diesen Freimengen. Sobald ein Tarif auf Pay-as-you-go umgestellt wird, gilt das nicht mehr. Deshalb nur den ausdrücklich kostenlosen Tarif nutzen und kein Ausgabenlimit auf einen Bezahlplan heben.

## Option A — Vercel Function und Upstash Redis

Eine Hobby-Function nimmt `POST /api/rangliste` mit Rufname und Punktestand entgegen und liest die Top-Liste per `GET`. Upstash Redis liegt als Marketplace-Integration am Projekt, Region Frankfurt (`eu-central-1`).

Der Punktestand steht in einem Sorted Set (`ZADD blizzwar:scores`). Pro Rufname zählt nur der beste Wert. Die Function prüft den Namen mit derselben Regel wie das Spiel: trimmen, innere Leerzeichen behalten, Steuerzeichen und `<>&"'`` entfernen, Länge 2 bis 32. Der Punktestand ist eine ganze Zahl zwischen 0 und einer festen Obergrenze (zum Beispiel 200.000), darüber wird abgelehnt.

Spam: höchstens ein Schreibzugriff je Hash der IP in zehn Minuten, Zähler mit TTL, der Hash wird nicht neben dem Punktestand gespeichert. Ein verstecktes Zusatzfeld im Formular bleibt leer; ist es gefüllt, wird der Aufruf verworfen. Gleiche Werte in kurzer Folge werden ignoriert.

Das passt zu einer Rangliste, weil Redis die Sortierung übernimmt und die Function kurz bleibt. Aufwand: eine Route, die Umgebungsvariablen der Marketplace-Integration, der bestehende Senden-Knopf ruft `fetch` auf und zeigt die Antwort in der vorhandenen Statuszeile. Kein neues Frontend-Paket.

## Option B — Vercel Function und Neon Postgres

Dieselbe Function, die Tabelle `scores (nickname text, score integer, created_at timestamptz)`. Pro Rufname ein Datensatz, beim Senden `INSERT … ON CONFLICT` auf den höheren Punktestand. Region in der EU.

Neon Free reicht für diese Tabelle. Der erste Aufruf nach einer Pause kann durch das Aufwachen der Datenbank etwas dauern. Aufwand wie bei A, plus eine kurze SQL-Anlage. Sinnvoll, wenn später Verlauf oder Saisons dazukommen. Für die reine Top-Liste ist Redis schlanker.

## Option C — Global Config

Global Config ist für selten geänderte, oft gelesene Werte gedacht. Hobby erlaubt etwa 100 Schreibzugriffe im Monat. Jede neue Punktzahl wäre ein Schreibzugriff. Das reicht nicht für eine offene Liste. Nur als Notnagel, wenn die Liste von Hand gepflegt wird, nicht als Empfehlung.

## Option D — Ablage über GitHub

Eine Function schreibt mit einem feinen Zugriffstoken (nur Inhalt eines Repos, nur als Umgebungsvariable, nie im Client) einen Eintrag in `leaderboard.json` oder legt einen Commit an. Kosten 0 €, weil GitHub und Hobby nichts berechnen.

Grenzen: die API erlaubt mit Token etwa 5.000 Anfragen pro Stunde, gleichzeitige Schreibvorgänge kollidieren, jeder Punktestand erzeugt Historie. Das Token ist ein Geheimnis und muss rotierbar bleiben. Spamschutz wie bei A, sonst füllt jemand die Historie. Aufwand höher als A oder B, Betrieb unruhiger. Nutzbar, wenn kein zweiter Dienst gewünscht ist und die Liste klein bleibt.

## Datenschutz

Gespeichert werden nur der selbst gewählte Rufname, der Punktestand und der Zeitpunkt. Kein Konto, keine E-Mail, keine Kennung aus einem Login. Die IP dient höchstens als kurzlebiger Hash für die Begrenzung und wird nicht in der Liste abgelegt.

Der Rufname ist öffentlich. Wer erkennbar ist, gibt damit ein Datum preis. Der Hinweis auf der Seite sagt deshalb: kein Klarname, nur ein Rufname. Rechtsgrundlage ist die freiwillige Veröffentlichung dieses Rufnamens und des Punktestands. Speicherort EU (Frankfurt). Es gibt kein Profiling und keine Weitergabe an Werbedienste. Alte Einträge außerhalb der Top-Liste können entfallen. Eine kurze Datenschutzerklärung auf der Seite nennt diese Punkte, bevor die Liste live geht. Das ist eine technische Einordnung, keine Rechtsberatung.

## Aufwand

Gering und lokal begrenzt: eine Serverless-Route, ein kostenloser Speicher, der vorhandene Senden-Knopf. Kein neues Framework, kein Bezahldienst, keine Änderung an den Mars-Inhalten. Die Umsetzung wartet auf Uwes Freigabe und legt vorher keinen Account und keinen Store an.

## Empfehlung

Option A. Vercel Function auf Hobby plus Upstash Redis im kostenlosen Tarif, Region Frankfurt. 0 €, solange die Freimengen gelten und der Tarif nicht auf Pay-as-you-go wechselt. Redis sortiert die Liste, die Function bleibt klein, Neon bleibt die Alternative, falls später SQL nötig wird. Global Config scheidet wegen der Schreibgrenze aus. GitHub bleibt der Ersatz ohne zweiten Anbieter.

Nicht umgesetzt: keine Function, kein Redis, kein Neon, kein Token, keine Vercel-Einstellung.
