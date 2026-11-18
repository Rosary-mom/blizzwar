# Mehrspieler, kostenlos

Plan für ein späteres gemeinsames Spiel. Es wird hier nicht gebaut: kein Raum, kein Socket, kein Konto, kein neuer Dienst.

## Was ein Mehrspieler bräuchte

Zwei Browser müssten Schiff, Schüsse und den Ceres-Anflug zur selben Zeit sehen. Heute rechnet jedes Gerät allein. Eine gemeinsame Rangliste ersetzt das nicht, weil sie nur einen Punktestand speichert und nicht die Stellung im Flug.

## Optionen ohne Bezahlplan

**Nur lokal.** Jeder spielt für sich. Kosten 0 €, kein zweiter Anbieter. Das ist der heutige Stand.

**WebRTC direkt zwischen den Browsern.** Zwei Spieler tauschen die Stellung ohne eigenen Spielserver. Ein kurzer Vermittler (Signaling) reicht, um die Verbindung aufzubauen. Öffentliche Vermittler sind unzuverlässig und liegen oft nicht in der EU. Ein eigener Vermittler auf Vercel Hobby wäre eine kleine Function, aber Hobby-Functions sind kurze Anfragen, keine dauerhaft offenen Kanäle. Aufwand: das Spiel müsste die Bewegung an einer Stelle ausrechnen und die andere Seite nur zeichnen. Das ist der größte Umbau.

**Fertige Echtzeitdienste mit Freimenge.** Ably, PartyKit oder ähnliche Anbieter haben kleine kostenlose Kontingente. Jeder davon verlangt eine Anmeldung. Sobald die Freimenge zu Ende ist, wird der Dienst langsam oder kostenpflichtig. Für ein Hobby-Spiel ohne Karte ist das dieselbe Hürde wie bei der Rangliste.

**Mitspielen über die Rangliste.** Nur Namen und Punkte, kein gemeinsamer Flug. Das wäre die kleine Variante und hängt an derselben kostenlosen Datenbank, die noch nicht verbunden ist.

## Aufwand

Der lokale Zustand bleibt, wie er ist. Ein echtes Mitspielen ändert die Spielschleife: eine Instanz rechnet, die andere empfängt. Dazu kommen ein Raumname, ein Abbruch, wenn die Verbindung weg ist, und ein Hinweis, dass keine weiteren persönlichen Daten gespeichert werden. Das ist deutlich mehr als eine Rangliste. Eine Rangliste allein ist nur eine Function und ein Speicher.

## Empfehlung

Jetzt nicht bauen. Zuerst die Rangliste, sobald die Marketplace-Anmeldung für einen Free-Tarif ohne Karte bewusst gemacht wird. Danach, wenn zwei Personen wirklich gleichzeitig fliegen sollen, ein WebRTC-Raum mit einem kurzen Vermittler in der EU und ohne Konto. Kein Bezahldienst, keine dauerhafte Verbindung auf dem Hobby-Plan erzwingen.

## Datenschutz

Ein Raum dürfte nur einen Rufnamen und die Spielstellung für die Dauer der Runde halten. Keine E-Mail, keine IP in der Runde. Die IP höchstens gehasht und mit Ablauf für eine Begrenzung der Raumeröffnungen.
