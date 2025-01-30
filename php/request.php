<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: *');
header('Access-Control-Allow-Headers: X-Requested-With, origin, content-type');
if(isset($_POST['jSonRichiesta'])==false)
{
    echo "Errore: richiesta non valida";
    die();
}
    $request=$_POST['jSonRichiesta'];
    $request=json_decode($request);
    global $error;
    if(isset($request->azione)==false)
    {
        echo "Errore: azione non valida";
        die();
    }

    $azione=$request->azione;
    $categoria=$request->categoria;
    switch($azione){
        case 'caricaDati':
            require_once('caricaDati.php');
            $caricaDati=new caricaDati();
            $dati=$request->dati;
            $res=$caricaDati->carica($dati,$categoria);
            break;
        case 'leggiDati':
            require_once('leggiDati.php');
            $leggiDati=new leggiDati();
            $classifica=$request->classifica;
            $res=$leggiDati->leggi($categoria,$classifica);
            break;
    }
    echo elaboraRisposta($res);
    function elaboraRisposta($res){
        $risposta=[];
        global $error;
        if($res==false){
            $risposta['esito']=false;
        }
        else{
            $risposta['esito']=true;
            if(is_array($res)){
                $risposta['dati']=$res;
            }
            else{
                $risposta['dati']=[];
            }
        }
        if($error==null){
            $error='';
        }
        $risposta['error']=$error;
        return json_encode($risposta);
    }
?>