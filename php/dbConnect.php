<?php

class dbConnect
{
    private $conn;
    private $dbh;
    private $server = "pc-marco\sql2019";
    private $db = "CF91011";
    function __construct() {}
    public function creaConnessione()
    {
        try {

            $this->dbh = new PDO(
                "sqlsrv:Server=" . $this->server  . ";DataBase=" . $this->db,
                'online',
                'lineon',
                array(
                    PDO::ATTR_TIMEOUT => 60, // in seconds
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
                ),


            );
        } catch (PDOException $e) {
            print $e->getMessage();
            die();
        }
    }
    public function iniziaTransazione()
    {
        try {
            $this->dbh->beginTransaction();
            return true;
        } catch (PDOException $e) {
            $this->logTxt('Errore inizio transazione', $e->getMessage());
            return false;
        }
    }
    public function getConnessione(){
        return $this->dbh;
    }
    public function fineTransazione()
    {
        try {
            $this->dbh->commit();
            return true;
        } catch (PDOException $e) {
            return false;
        }
    }
    public function backTransazione()
    {
        try {
            $this->dbh->rollBack();
            return true;
        } catch (PDOException $e) {
            $this->logTxt('Errore fine transazione', $e->getMessage());
            return false;
        }
    }
    public function logTxt($errore, $DescrizioneLog = '')
    {
        $myfile = fopen(__DIR__ . "/../error.txt", "a") or die("Unable to open file!");
        $txt = date(' H:i:s d/m/Y - ') . $DescrizioneLog . " - " . $errore . " \r\n";
        fwrite($myfile, $txt);
        fclose($myfile);
    }
    public function eseguiQuery($query, $recordAll = true, $return = 'array',$consentiErrori=false)
    {
        try {
            global $error;
            $stmt = $this->dbh->prepare($query);

            if (!$stmt->execute()) {
                $resultExecute = false;
            } else {
                $resultExecute = true;
            }
            $cNum=$stmt->columnCount();
            if($cNum==0){
                return [0];
            }
            if ($recordAll && $return != 'bool' && $return != 'id') {
                $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
            } else if ($recordAll == false && $return != 'bool' && $return != 'id') {
                $result = $stmt->fetch(PDO::FETCH_ASSOC);
            } else if ($recordAll == null) {
            }
            if ($resultExecute) {
                if ($return == 'json') {
                    return $result = json_encode($result, true);
                } else if ($return == 'array') {
                    return $result;
                } else if ($return == 'id') {
                    return $this->dbh->lastinsertid();
                } else if ($return == 'bool') {
                    return $resultExecute;
                }
            } else {
                
                return false;
            }
        } catch (PDOException $e) {
            $testo = $e->getFile() . "#" . $e->getLine() . " - " . $e->getCode() . ': ' . $e->getMessage() . "\r\n $query \r\n";

            $error .= 'ERRORE SQL -' . $testo;
            $this->logTxt($testo, 'ECCEZIONE PDO');
        if($consentiErrori==true){
            $error = '';
            return false;
        }
            return false;
        }
    }
}
?>